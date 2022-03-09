import React from "react";

const Conversation = ({ userID, username, image, onClick, lastMessage }) => {
  return (
    <div className="conv-item" onClick={() => onClick({ userID, username })}>
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
