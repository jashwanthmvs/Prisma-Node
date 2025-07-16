import {Router} from "express";
import {createTag, getAllTags, getTag, updateTag, deleteTag, fetchTagByPrefix} from "../Controller/TagController.js";
const router = Router();

router.post("/create-tag", createTag);
router.get("/get-all-tags", getAllTags);
router.get("/get-tag/:id", getTag);
router.put("/update-tag/:id", updateTag);
router.delete("/delete-tag/:id", deleteTag);
router.get("/get-tag-by-prefix", fetchTagByPrefix);

export default router; 
