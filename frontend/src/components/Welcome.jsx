import React, { useEffect, useState } from "react";
import Robot from "../assets/anh/anhdaidien.jpg";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (userData) {
        setUserName(JSON.parse(userData).username);
      }
    };
    fetchUserName();
  }, []);

  return (
    <div className="welcome-container">
      <img src={Robot} alt="Welcome robot" />
      <h1>
        Xin chào đến với TLO chat của chúng tôi
        <p><b><span>{userName}</span></b>!</p>
      </h1>
      <h2>Hãy chọn một cuộc trò chuyện để bắt đầu</h2>
    </div>
  );
}
