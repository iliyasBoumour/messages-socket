import { useState, useEffect, useContext } from "react";
import Conversation from "./components/Conversation";
import Discussion from "./components/Discussion";
import { Store } from "./utils/store";
import socket from "./utils/socket";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const { state, dispatch } = useContext(Store);
  const {
    auth: { user },
  } = state;

  const initUser = (user) => {
    user.messages = [];
    user.hasNewMessages = false;
    user.connected = true;
  };
  useEffect(() => {
    if (!socket.auth) {
      console.log("reconnect");
      socket.auth = { sessionID: user.sessionID };
      socket.user = user.userID;
      socket.connect();
    }
  }, [user]);

  socket.on("users", (urs) => {
    urs.forEach((u) => initUser(u));
    setUsers(urs.filter((u) => u.userID !== socket.user));
    //  && u.connected
  });
  useEffect(() => {
    socket.on("user connected", (user) => {
      const isExists = users.findIndex((u) => u.userID === user.userID);
      if (isExists > -1) {
        setUsers(
          users.map((u) =>
            u.userID === user.userID ? { ...u, connected: true } : u
          )
        );
        // TODO problem here
        if (currentConv?.userID === user.userID) {
          console.log("set online");
          setCurrentConv({ ...currentConv, connected: true });
        }
      } else if (user.userID !== socket.user) {
        initUser(user);
        setUsers([...users, user]);
      }
    });
    socket.on("user disconnected", (id) => {
      setUsers(
        users.map((u) => (u.userID === id ? { ...u, connected: false } : u))
      );
      // TODO problem here
      if (currentConv?.userID === id) {
        console.log("set offline");
        setCurrentConv({ ...currentConv, connected: false });
      }
    });
    socket.on("private message", (msg) => {
      let newUs;
      if (msg.to === socket.user) {
        newUs = users.map((u) =>
          u.userID !== msg.from
            ? u
            : currentConv?.userID !== msg.from
            ? { ...u, messages: [...u.messages, msg], hasNewMessages: true }
            : { ...u, messages: [...u.messages, msg] }
        );
      } else {
        newUs = users.map((u) =>
          u.userID !== msg.to ? u : { ...u, messages: [...u.messages, msg] }
        );
      }
      if (currentConv?.userID === msg.from || currentConv?.userID === msg.to) {
        setCurrentConv({
          ...currentConv,
          messages: [...currentConv?.messages, msg],
        });
      }
      setUsers(newUs);
    });
    return () => {
      socket.off("users");
      socket.off("user connected");
      socket.off("private message");
      socket.off("user disconnected");
    };
  }, [currentConv, user, users]);

  const emitMessage = (msg, userID) => {
    //TODO  change from
    const message = { msg, to: userID, from: socket.user };
    socket.emit("private message", message);
    setCurrentConv({
      ...currentConv,
      messages: [...currentConv.messages, message],
    });
    const newUS = users.map((u) => {
      return u.userID !== message.to
        ? u
        : { ...u, messages: [...u.messages, message] };
    });
    setUsers(newUS);
  };

  const openConv = (user) => {
    const cc = users.find((c) => c.userID === user);
    cc.hasNewMessages = false;
    setCurrentConv(cc);
  };
  return (
    <div className="chat-container">
      {/* <button
        onClick={() => {
          dispatch({ type: "USER_LOGOUT" });
          socket.disconnect();
        }}
      >
        logout
      </button> */}
      <div className="paper">
        <div className="conv">
          {users.map((user, i) => (
            <Conversation
              key={i}
              onClick={openConv}
              current={currentConv?.userID === user.userID}
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
