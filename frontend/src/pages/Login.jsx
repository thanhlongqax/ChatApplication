import React, { useEffect, useState } from "react";
import { Bars } from 'react-loader-spinner';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../assets/anh/Logo.png";
import { SignIn } from "../services";

export default function Login() {
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Email và Password là bắt buộc.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await SignIn(username, password);
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
      {isLoading ? (
        <div className="login-container">
          <Bars
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="bars-loading"
            visible={true}
          />
        </div>
      ) : (
        <div className="login-container">
          <form>
            <div className="brand">
              <img src={Logo} alt="logo" />
              <h1>Đăng nhập</h1>
            </div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
              min="3"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <button onClick={() => handleLogin()}>Đăng nhập</button>
            <span>
              Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </span>
          </form>
        </div>
      )}
      <ToastContainer />
    </>
  );
}
