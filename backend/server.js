const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
const socket = require("socket.io");

const { connectRabbitMQ, sendMessage, receiveMessages } = require("./rabbitmq/rabbitmq");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL, {

    })
    .then(async () => {
        console.log("Database connection successful!");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
    console.log(`Server is running port: ${process.env.PORT}`)
);
const io = socket(server, {
    cors: {
        origin: "http://localhost:3003",
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

global.onlineUsers = new Map();

// Kết nối mới từ client
io.on("connection", (socket) => {
    // Lưu thông tin socket của client hiện tại vào biến toàn cục chatSocket
    global.chatSocket = socket;

    // client gửi yêu cầu thêm người dùng mới vào danh sách online
    socket.on("create-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`Người dùng ${userId} đã được thêm vào danh sách online.`);
    });

    // client gửi tin nhắn, gửi tin đến người nhận nếu người đó online
    socket.on("delivery-message", async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);

        // Gửi tin nhắn qua RabbitMQ
        try {
            await connectRabbitMQ();
            const newMessage = {
                content: data.msg,
                from: data.from,
                to: data.to,
            };
            await sendMessage(newMessage);

            if (sendUserSocket) {
                // Gửi tin nhắn đến người nhận nếu họ đang online
                socket.to(sendUserSocket).emit("message-receive", newMessage);
            }
        } catch (error) {
            console.error("Error sending message via RabbitMQ:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Một kết nối socket đã rời đi: ${socket.id}`);
        // Tìm userId dựa trên socket.id
        const disconnectedUserId = [...onlineUsers.entries()].find(([key, value]) => value === socket.id)?.[0];

        // Xóa người dùng từ danh sách online nếu có userId
        if (disconnectedUserId) {
            onlineUsers.delete(disconnectedUserId);
            console.log(`Người dùng ${disconnectedUserId} đã rời đi.`);
        }
    });
});


app.get("/test", (req, res) => {
    const totalOnlineUsers = onlineUsers.size;
    console.log(`Tổng số người dùng đang online: ${totalOnlineUsers}`);
    return res.send(`Tổng số người dùng đang online: ${totalOnlineUsers}`)
})
connectRabbitMQ()
    .then(() => {
        console.log("RabbitMQ connection successful");
        receiveMessages(); 
    })
    .catch(err => {
        console.error("Error initializing RabbitMQ:", err);
    });
