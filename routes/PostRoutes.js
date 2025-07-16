import {Router} from "express";
import {createPost, showAllPosts, showPost, updatePost, deletePost, fetchPostByLogic} from "../Controller/PostController.js";

const router = Router();

router.post("/create-post", createPost);
router.get("/get-all-posts", showAllPosts);
router.get("/get-post/:id", showPost);
router.put("/update-post/:id", updatePost);
router.delete("/delete-post/:id", deletePost);
router.get("/get-post-by-logic", fetchPostByLogic);

export default router;
