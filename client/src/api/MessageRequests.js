import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const getMessages = (id) => API.get(`/message/${id}`);

export const getAllMessages = (chatid, senderId) =>
  API.get(`/message/${chatid}/${senderId}`);

export const addMessage = (data) => API.post("/message/", data);
