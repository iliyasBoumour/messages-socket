import { useState } from "react";
import socket from "../utils/socket";

const Discussion = ({ username, userID, messages, connected, emitMessage }) => {
  const [msg, setMsg] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    if (msg) {
      emitMessage(msg, userID);
      setMsg("");
    }
  };
  return (
    <div className="disc">
      <div className="disc-info">
        <img className="conv-img" src="/images/avatar.png" alt={username} />
        <h3>{username}</h3>
        <p>{connected ? "Online" : "Offline"}</p>
      </div>
      <div className="disc-msgs">
        {messages?.map((m, i) => (
          <p
            key={i}
            className={`message ${m.from === socket.user ? "owner" : ""}`}
          >
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
