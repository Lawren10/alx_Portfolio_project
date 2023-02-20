import express from "express";
import {
  createChat,
  findChat,
  userChats,
  findAllChat,
} from "../controllers/ChatController.js";
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.get("/findall/:firstId/:secondId", findAllChat);

export default router;
