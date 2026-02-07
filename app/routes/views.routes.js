import express from "express";
import postsModel from "../models/posts.model.js";
const router = express.Router();

router.get("/raw/:key", async (req, res) => {
    const { key } = req.params;

    if (!key) {
        return res.redirect("/");
    }
    try {
        const response = await postsModel.getByid(key);

        if (!response || response.length === 0) {
            return res.render("index", { message: "No such post" });
        }

   
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.send(response[0]?.body);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
router.get("/:key", async (req, res) => {
    const { key } = req.params;

    if (!key) {
        return res.redirect("/");
    }
    try {
        const response = await postsModel.getByid(key);

        if (!response || response.length === 0) {
            return res.render("index", { message: "No such post" });
        }

        res.render("post", { data: response[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



router.get("/", async (req, res) => {
    return res.render("index");
});

export default router;