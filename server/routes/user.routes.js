import { Router } from "express";
import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
