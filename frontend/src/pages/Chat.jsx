import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatContainer from "../components/Chat/ChatBoard";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsers } from "../services";

export default function Chat() {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        async function fetchUser() {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                navigate("/login");
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
                    )
                );
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(process.env.REACT_APP_API_URL, {
                transports: ["websocket", "polling"],
              });
            socket.current.on("connect", () => {
                console.log(`Connected to socket: ${socket.current.id}`);
                socket.current.emit("create-user", currentUser._id);
            });
            // socket.current.emit("create-user", currentUser._id);
            // console.log(`Connected to socket: ${socket.current.id}`);
            window.addEventListener("beforeunload", handleDisconnect);

            return () => {
                handleDisconnect();
                window.removeEventListener("beforeunload", handleDisconnect);
            };
        }
    }, [currentUser]);
    const handleDisconnect = () => {
        if (socket.current) {
            socket.current.emit("user-disconnect", currentUser._id);
            socket.current.disconnect();
            console.log("User disconnected:", currentUser._id);
        }
    };
    useEffect(() => {
        async function fetchData() {
            if (currentUser) {
                const data = await allUsers(currentUser._id);
                setContacts(data.data);
            }
        }
        fetchData();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <>
                <div className="chat-container">
                    <Contacts contacts={contacts} changeChat={handleChatChange} />
                    {currentChat === undefined ? (
                        <Welcome />
                    ) : (
                        <ChatContainer currentChat={currentChat} socket={socket} />
                    )}
                </div>
        </>
    );
}

