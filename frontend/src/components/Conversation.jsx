import React from "react";

const Conversation = ({
  socketID,
  username,
  image,
  onClick,
  hasNewMessages,
  current,
}) => {
  return (
    <div
      className={`conv-item ${current ? "active" : ""} `}
      onClick={() => onClick(socketID)}
    >
      {hasNewMessages && <div className="badge"></div>}
      <img
        src={image || "/images/avatar.png"}
        alt={username}
        className="conv-img"
      />
      <div className="con-info">
        <h4>{username}</h4>
        {/* <p>{lastMessage}</p> */}
      </div>
    </div>
  );
};

export default Conversation;
