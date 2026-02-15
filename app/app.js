import express from "express";
import constants from "./configs/constants.js";
import path from "path";
import { connectDB } from "./configs/dbConnection.js";
import migrate from "./configs/Migration.js";
import postRouter from "./routes/posts.routes.js";
import viewRouter from "./routes/views.routes.js";
import http from "http";
import { Server } from "socket.io";
import { updateByid } from "./models/posts.model.js"
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { PORT } = constants;

app.set('view engine', 'ejs');
app.set("views", path.resolve("./app/views"));
app.use(express.static(path.resolve("./app/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// socket
const pasteLocks = new Map();
// pasteKey -> socket.id

io.on("connection", (socket) => {

  socket.on("joinPaste", ({ pasteKey }) => {
    socket.join(pasteKey);
  });

  socket.on("lockPaste", ({ pasteKey }) => {
    // if nobody holds lock
    if (!pasteLocks.has(pasteKey)) {
      pasteLocks.set(pasteKey, socket.id);

      socket.to(pasteKey).emit("lock", {
        lock: true,
        editor: socket.id
      });
    }
  });

  socket.on("unlockPaste", ({ pasteKey }) => {
    if (pasteLocks.get(pasteKey) === socket.id) {
      pasteLocks.delete(pasteKey);

      socket.to(pasteKey).emit("lock", {
        lock: false
      });
    }
  });

  socket.on("updatePaste", async ({ pasteKey, body }) => {
    await updateByid(pasteKey, body)
    socket.to(pasteKey).emit("pasteUpdated", { body });
  });

  // auto unlock on disconnect
  socket.on("disconnect", () => {
    for (const [pasteKey, owner] of pasteLocks.entries()) {
      if (owner === socket.id) {
        pasteLocks.delete(pasteKey);

        socket.to(pasteKey).emit("lock", {
          lock: false
        });
      }
    }
  });

});


app.use("/", viewRouter);
app.use("/api/post", postRouter);
// app.get("/", async (req, res) => {
//   res.render("index")
// });
server.listen(PORT, () => {
  connectDB()
    .then(() => {
      migrate();
    })
    .then(() => {
      console.log(`http://127.0.0.1:${PORT}`);
    })
    .catch((e) => {
      console.log(e);
    });
});
