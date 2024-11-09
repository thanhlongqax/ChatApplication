import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../assets/anh/Logo.png";
import { SignUp } from "../services";

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username } = values;
    if (password !== confirmPassword) {
      toast.error("Mật khẩu và mật khẩu xác nhận phải giống nhau!");
      return false;
    } else if (username.length < 3) {
      toast.error("Username phải lớn hơn 3 ký tự");
      return false;
    } else if (password.length < 6) {
      toast.error("Password phải bằng hoặc lớn hơn 6 ký tự!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    console.log(process.env.REACT_APP_SERVER_URL);
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await SignUp(username, password);

      if (data.status === false) {
        toast.error(data.message);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="register-container">
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Đăng ký</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Đăng ký</button>
          <span>
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
