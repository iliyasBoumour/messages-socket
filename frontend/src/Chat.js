import { useState, useEffect, useContext } from "react";
import Conversation from "./components/Conversation";
import Discussion from "./components/Discussion";
import { Store } from "./utils/store";
import socket from "./utils/socket";

// const initUsers = [
//   {
//     userID: 1,
//     username: "ib",
//     messages: [{ msg: "salut ib" }],
//     hasNewMessages: false,
//     connected: true,
//   },
//   {
//     userID: 2,
//     username: "bi",
//     messages: [{ msg: "salut bi" }],
//     hasNewMessages: false,
//     connected: true,
//   },
//   {
//     userID: 3,
//     username: "ha",
//     messages: [{ msg: "salut ha" }],
//     hasNewMessages: false,
//     connected: true,
//   },
// ];

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const { dispatch } = useContext(Store);
  const initUser = (user) => {
    user.messages = [];
    user.hasNewMessages = false;
    user.connected = true;
  };
  useEffect(() => {
    socket.on("users", (urs) => {
      urs.forEach((u) => initUser(u));
      setUsers(urs.filter((u) => u.socketID !== socket.id));
    });
    socket.on("user connected", (user) => {
      initUser(user);
      setUsers([...users, user]);
    });
    socket.on("private message", (msg) => {
      const newUs = users.map((u) =>
        u.socketID !== msg.from
          ? u
          : currentConv?.socketID !== msg.from
          ? { ...u, messages: [...u.messages, msg], hasNewMessages: true }
          : { ...u, messages: [...u.messages, msg] }
      );
      if (currentConv?.socketID === msg.from) {
        setCurrentConv({
          ...currentConv,
          messages: [...currentConv.messages, msg],
        });
      }
      setUsers(newUs);
    });
    return () => {
      socket.off("users");
      socket.off("user connected");
      socket.off("private message");
    };
  }, [currentConv, users]);

  const emitMessage = (msg, socketID) => {
    //TODO  change from
    const message = { msg, to: socketID, from: socket.id };
    socket.emit("private message", message);
    setCurrentConv({
      ...currentConv,
      messages: [...currentConv.messages, message],
    });
    const newUS = users.map((u) => {
      return u.socketID !== message.to
        ? u
        : { ...u, messages: [...u.messages, message] };
    });
    setUsers(newUS);
  };

  const openConv = (user) => {
    const cc = users.find((c) => c.socketID === user);
    cc.hasNewMessages = false;
    setCurrentConv(cc);
  };
  return (
    <div className="chat-container">
      <button onClick={() => dispatch({ type: "USER_LOGOUT" })}>logout</button>
      <div className="paper">
        <div className="conv">
          {users.map((user, i) => (
            <Conversation
              key={i}
              onClick={openConv}
              current={currentConv?.socketID === user.socketID}
              {...user}
            />
          ))}
        </div>
        {currentConv && (
          <Discussion {...currentConv} emitMessage={emitMessage} />
        )}
      </div>
    </div>
  );
};

export default Chat;
