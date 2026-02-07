import crypto from "crypto";
import postsModel from "../models/posts.model.js";
export const getPosts = async (req, res) => {
  try {
    const response = await postsModel.all();
    if (!response.length) {
      return res.status(200).json({ status: false, message: "No posts found" })
    }
    return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log("post.controller->grtPosts")
    return res.status(500).json({
      status: false,
      message: "No posts mound"
    });
  }
};

const generateRandomKey = async (rowId) => {
  return (
    Date.now().toString(36) +
    rowId.toString(36) +
    Math.random().toString(36).slice(2, 4)
    +rowId
  )
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
    const postKey = await generateRandomKey(count.length);
    const response = await postsModel.create(name, body, postKey);

    return res.status(200).json({
      message: "Success",
      data: response,
    });
  } catch (e) {
    console.log("posts.controller->createPost");
    return res.status(500).json({ status: false, message: "Failed To create a post" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { key } = req?.params;
    if (!key) {
      return res.status(400).json({
        status: false,
        message: "Missing Info",
        missing: {
          key: !key
        }
      })
    }
    const respone = await postsModel.getByid(key);
    if(!respone.length) return res.status(200).json({status:false,message:"No Such Post"})
    return res.status(200).json({ status: true, data: respone })

  } catch (e) {
    console.log("posts.controller->getPostById", e);
    return res.status(500).json({ status: false, message: "Srver error something wennt wrong" });
  }
}