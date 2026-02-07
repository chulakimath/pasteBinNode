import crypto from "crypto";
import postsModel from "../models/posts.model.js";
export const getPosts = async (req, res) => {
  res.json({
    status: 200,
    message: "/api/posts",
    data: [1, 2, 3],
  });
};

const generateRandomKey = async (rowId) => {
  return (
    Date.now().toString(36) +
    rowId.toString(36) +
    Math.random().toString(36).slice(2, 4)
  ).slice(-8);
};
export const createPost = async (req, res) => {
  try {
    const { name, body } = req?.body;
    if (!name || !body) {
      return res.status(400).json({
        success: false,
        message: "missing fields",
        missing: {
          name: !name,
          body: !body,
        },
      });
    }
    const count = await postsModel.count();
    const postKey = await generateRandomKey(count);

    res.status(200).json({
      message: "Success",
      data: { name, body, postKey, count: count?.[0]?.length },
    });
  } catch (e) {
    res.status(500).json({ status: 500 });
  }
};
