import {Router} from "express";
import {createUser, updateUser, getAllUsers, getUser, deleteUser, loginUser} from "../Controller/UserController.js";
const router = Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/get-all-users", getAllUsers);
router.get("/get-user/:id", getUser);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
