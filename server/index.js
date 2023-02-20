import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
// const http = require("http");
// const chatSocket = require("socket.io");

// routes
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import UploadRoute from "./routes/UploadRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import MessageRoute from "./routes/MessageRoute.js";

//initializing the servers

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// to serve images inside public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

//different routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/posts", PostRoute);
app.use("/upload", UploadRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

app.get("/", (req, res) => {
  res.send("connected sucess");
});

//chat socket

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId._id === newUserId._id)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers.length);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers.length);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    // const user = activeUsers.find((user) => user.userId === receiverId);
    const user = activeUsers.find((user) => user.userId._id === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});

// dotenv.config();
// const PORT = process.env.PORT;
const MYPORT = 8000;

// const CONNECTION =process.env.MONGODB_CONNECTION;
const MYMONGOCONNECTION =
  "mongodb+srv://denigma:DaGKomLFHXS8UOaw@denigmacluster.c6ck8sl.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(MYMONGOCONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(MYPORT, () => console.log(`Listening at Port ${MYPORT}`))
  )
  .catch((error) => console.log(`${error} did not connect`));
