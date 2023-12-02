import { Router } from "express";
import { UsersController } from "./users.controller";
import verifyAuth from "../../middlewares/verifyAuth";
const router = Router();

const usersController = new UsersController();

router.get("/profile", verifyAuth, usersController.getProfile);

export default router;
