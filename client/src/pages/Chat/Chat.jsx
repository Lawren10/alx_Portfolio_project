import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../api/UserRequests";
import { io } from "socket.io-client";

const Chat = () => {
  // const dispatch = useDispatch();
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData.data);
  // state.authReducer.authData
  const [chats, setChats] = useState([]);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        const { allData } = await getAllUser();
        setChats(data);
        console.log("all data", allData);
        // setChats([]);
      } catch (error) {
        console.log(error);
      }
    };
    // getChats();
  }, [user]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.emit("new-user-add", user);
    socket.current.on("get-users", (users) => {
      // setOnlineUsers(users);
      let availableChat = users.filter((user1) => {
        return user1.userId._id !== user._id;
      });
      availableChat = availableChat.map((user) => {
        return user.userId;
      });
      setChats(availableChat);
      console.log("availableChat", availableChat);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
    console.log("setmessage use effect", sendMessage);
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log("received data", data);
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    // const chatMember = chat.members.find((member) => member !== user._id);
    // const chatMember = chat.find((member) => member !== user._id);
    // const online = onlineUsers.find((user) => user.userId === chatMember);
    // return online ? true : false;
    return true;
  };

  console.log("from chat for user", user);

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats &&
              chats.map((chat) => (
                <div
                  onClick={() => {
                    setCurrentChat(chat);
                  }}
                  key={chat._id}
                >
                  <Conversation
                    data={chat}
                    currentUser={user._id}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          // currentUser={"user"}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
