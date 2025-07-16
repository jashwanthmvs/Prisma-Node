import {Router} from "express";
import userRoutes from "./userRoutes.js";
import postRoutes from "./PostRoutes.js";
import commentRoutes from "./commentRoutes.js";
import tagRoutes from "./tagRoutes.js";

const router = Router();
router.use("/user", userRoutes); 
router.use("/post", postRoutes); 
router.use("/comment", commentRoutes);
router.use("/tag", tagRoutes);  
//explain above line
// /api/user is the base URL for all user routes
// userRoutes is the router object that contains all user routes
// router.use is a middleware function that mounts the userRoutes on the /api/user path
export default router;
