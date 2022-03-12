import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "./utils/store";
import socket from "./utils/socket";

const Login = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(Store);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.log("connect error");
      if (err.message === "invalid username") {
        dispatch({ type: "USER_LOGOUT" });
      }
    });
    socket.on("session", (credentials) => {
      socket.auth = { sessionID: credentials.sessionID };
      socket.user = credentials.userID;
      dispatch({
        type: "USER_LOGIN",
        payload: credentials,
      });
    });

    return () => {
      socket.off("connect_error");
    };
  }, [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    if (name) {
      socket.auth = { name };
      socket.connect();
      setName("");
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
