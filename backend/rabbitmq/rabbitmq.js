const amqp = require("amqplib");
const message = require("../schema/message");
let channel;
const EXCHANGE_NAME = "message_exchange";
const QUEUE_NAME = "message_queue";
const ROUTING_KEY = "message_route";

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // Tạo exchange
        await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

        // Tạo queue
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        // Liên kết queue với exchange bằng routing key
        await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

        console.log("Connected to RabbitMQ and configured exchange and queue");
    } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
    }
};

const sendMessage = (msg) => {
    channel.publish(EXCHANGE_NAME, ROUTING_KEY, Buffer.from(JSON.stringify(msg)), {
        persistent: true,
    });
    console.log("Message sent:", msg);
};

const receiveMessages =  () => {
    channel.consume(QUEUE_NAME, async (msg) => {
        const messageData = JSON.parse(msg.content.toString());
        // lưu vào database
        console.log(msg);
        const newMessage = await message.create({
            content: messageData.msg,
            from: messageData.from,
            to: messageData.to,
        });
        channel.ack(msg); 
    });
};

module.exports = { connectRabbitMQ, sendMessage, receiveMessages };
