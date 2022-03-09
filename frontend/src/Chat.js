import { useState, useEffect, useContext } from "react";
import Conversation from "./components/Conversation";
import Discussion from "./components/Discussion";
import { Store } from "./utils/store";
import socket from "./utils/socket";

const Chat = () => {
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);

  const { state } = useContext(Store);
  const {
    auth: { user },
  } = state;
  useEffect(() => {
    if (!socket.username && user.name) {
      console.log(user.name);
      socket.auth = { name: user.name };
      socket.connect();
    }
  }, [user]);

  socket.on("users", (users) =>
    setLoggedInUsers(users.filter((user) => socket.id !== user.userID))
  );
  socket.on("user connected", (user) =>
    setLoggedInUsers([...loggedInUsers, user])
  );
  const openConv = (user) => {
    setCurrentConv(user);
  };
  return (
    <div className="chat-container">
      <div className="paper">
        <div className="conv">
          {loggedInUsers.map((user) => (
            <Conversation key={user?.userID} onClick={openConv} {...user} />
          ))}
        </div>
        {currentConv && <Discussion {...currentConv} />}
      </div>
    </div>
  );
};

export default Chat;
