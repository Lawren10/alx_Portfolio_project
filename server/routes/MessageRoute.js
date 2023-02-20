import express from "express";
import {
  addMessage,
  getMessages,
  getAllMessages,
} from "../controllers/MessageController.js";

const router = express.Router();

router.post("/", addMessage);

router.get("/:chatId", getMessages);

router.get("/:chatId/:senderId", getAllMessages);

export default router;
