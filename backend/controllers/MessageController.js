const Messages = require("../schema/message");


class MessageController {
    async getMessages (req, res, next) {
        try {
            const { from, to } = req.body;

            const messages = await Messages.find({
                $or: [
                    { to : to, from: from },
                    { from: to, to: from }
                  ]
            }).sort({ updatedAt: 1 });

            const projectedMessages = messages.map((msg) => {
                return {
                    fromSelf: msg.from.toString() === from,
                    content: msg.content
                };
            });
            res.json(projectedMessages);
        } catch (ex) {
            next(ex);
        }
    };

    async addMessage (req, res, next){
        try {
            const { from, to, content } = req.body;
            const data = await Messages.create({
                content: content,
                to: to,
                from: from,
            });

            if (data) return res.json({ msg: "Đã thêm tin nhắn thành công!" });
            else return res.json({ msg: "Không thể thêm tin nhắn vào cơ sở dữ liệu!" });
        } catch (ex) {
            next(ex);
        }
    };

}

module.exports = new MessageController();