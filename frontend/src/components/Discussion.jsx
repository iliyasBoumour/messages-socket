import { useState } from "react";
import socket from "../utils/socket";

const Discussion = ({ userID, username }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    if (msg) {
      socket.emit("private message", { msg, to: userID });
      setMessages([...messages, { msg, to: userID }]);
      setMsg("");
    }
  };
  return (
    <div className="disc">
      <div className="disc-info">
        <img className="conv-img" src="/images/avatar.png" alt={username} />
        <h3>{username}</h3>
        <p>{"Online"}</p>
      </div>
      <div className="disc-msgs">
        {messages.map((m, i) => (
          <p key={i} className={`message ${m.to !== socket.id ? "owner" : ""}`}>
            {m.msg}
          </p>
        ))}
      </div>
      <div className="disc-send">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Enter your message"
          />
        </form>
      </div>
    </div>
  );
};

export default Discussion;
