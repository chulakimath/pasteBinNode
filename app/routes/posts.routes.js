import express from "express";
import { getPosts, createPost,getPostById } from "../controllers/posts.controller.js";
const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.get("/:key",getPostById)
export default router;
