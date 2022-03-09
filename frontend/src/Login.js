import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "./utils/store";
import socket from "./utils/socket";

const Login = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(Store);

  const openSocketConnection = () => {
    socket.auth = { name };
    socket.connect();
  };
  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      dispatch({ type: "USER_LOGOUT" });
    }
  });

  const submit = (e) => {
    e.preventDefault();
    if (name) {
      dispatch({
        type: "USER_LOGIN",
        payload: {
          id: window.id,
          name,
        },
      });
      setName("");
      openSocketConnection();
      window.id++;
      return navigate("/");
    }
  };

  return (
    <div className="form-container">
      <h1>TalkWithStranger</h1>
      <p>Here you can talk with a strange person and make a new relashions</p>
      <form onSubmit={submit} className="form">
        <label htmlFor="name">Enter Your Name</label>
        <input
          id="name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
