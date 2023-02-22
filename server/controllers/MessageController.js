import MessageModel from "../models/messageModel.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    // console.log(req.params.chatId, req.params.senderId);
    const chat = await MessageModel.find({
      $all: [req.params.firstId, req.params.secondId],
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
