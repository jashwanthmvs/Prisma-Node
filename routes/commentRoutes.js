import {Router} from "express";
import { createComment, showAllComments, showComment, updateComment, deleteComment, showAllCommentsOfPost } from "../Controller/CommentController.js";

const router = Router();

router.post("/create-comment", createComment);
router.get("/get-all-comments", showAllComments);
router.get("/get-all-comments-of-post/:id", showAllCommentsOfPost);
router.get("/get-comment/:id", showComment);
router.put("/update-comment/:id", updateComment);
router.delete("/delete-comment/:id", deleteComment);


export default router;
