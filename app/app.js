import express from "express";
import constants from "./configs/constants.js";
import path from "path";
import { connectDB } from "./configs/dbConnection.js";
import migrate from "./configs/Migration.js";
import postRouter from "./routes/posts.routes.js";
import viewRouter from "./routes/views.routes.js";
const app = express();

const { PORT } = constants;

app.set('view engine', 'ejs');
app.set("views", path.resolve("./app/views"));
app.use(express.static(path.resolve("./app/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",viewRouter);
app.use("/api/post", postRouter);
// app.get("/", async (req, res) => {
//   res.render("index")
// });
app.listen(PORT, () => {
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
