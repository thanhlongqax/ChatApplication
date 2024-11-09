const User = require("../schema/user");
const bcrypt = require("bcrypt");

class AuthController {
    async login (req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user)
                return res.json({ message: "Username không tồn tại!", status: false });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid)
                return res.json({ message: "Mật khẩu không chính xác!", status: false });
            delete user.password;
            return res.json({ status: true, message: "Đăng nhập thành công!", user });
        } catch (ex) {
            next(ex);
        }
    };

    async register (req, res, next) {
        try {
            const { username, password } = req.body;
            
            const usernameCheck = await User.findOne({ username });
            if (usernameCheck)
                return res.json({ message: "Username đã tồn tại!", status: false });

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                password: hashedPassword,
            });
            return res.json({ status: true, message: "Đăng ký tài khoản thành công!", user });
        } catch (ex) {
            next(ex);
        }
    };

    async getAllUsers (req, res, next) {
        try {
            const users = await User.find({ _id: { $ne: req.params.id } }).select([
                "email",
                "username",
                "_id",
            ]);
            return res.json(users);
        } catch (ex) {
            next(ex);
        }
    };

    async logOut (req, res, next){
        try {
            if (!req.params.id) return res.json({ message: "Id của user là bắt buộc!" });
            onlineUsers.delete(req.params.id);
            return res.status(200).send();
        } catch (ex) {
            next(ex);
        }
    };

}

module.exports = new AuthController();