import express from "express";
import constants from "./configs/constants.js";
import { connectDB } from "./configs/dbConnection.js";
import postRouter from "./routes/posts.routes.js";
import migrate from "./configs/Migration.js";
const app = express();
const { PORT } = constants;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/post", postRouter);
app.get("/", async (req, res) => {
  res.json({ staus: 200 });
});
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
