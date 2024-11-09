import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addMessage, getMessage } from "../../services";
import ChatInput from "./ChatInput";
import avatar from "../../assets/anh/avatar.png";

export default function ChatBoard({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const scrollRef = useRef();
  const getUserData = async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    return data;
  };
  const fetchMessages = async () => {
    const data = await getUserData();
    const response = await getMessage(data._id, currentChat._id);
    const formattedMessages = response.data.map(message => ({
      fromSelf: message.from === data._id, 
      message: message.content, 
      timestamp: message.timestamp, 
      id: message._id, 
    }));
    setMessages(formattedMessages);
  };
  useEffect(() => {
    fetchMessages();
  }, [currentChat]);
  useEffect(() => {
    if (newMessage) {
      fetchMessages();
    }
  }, [newMessage]);
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (content) => {
    const data = await getUserData();
    socket.current.emit("delivery-message", {
      to: currentChat._id,
      from: data._id,
      content,
    });
    await addMessage(data._id,currentChat._id,content,);
    const allMessage = [...messages];
    allMessage.push({ fromSelf: true, message: content });
    setMessages(allMessage);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-recieve", (message) => {
        setNewMessage(message);
        setMessages((prev) => [...prev, { fromSelf: false, message: message.content }]);
      });
    }
    return () => {
      socket.current.off("message-recieve");
    };
  }, [socket]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="chat-message">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={avatar}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>

      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>

  );
}