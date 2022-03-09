import { io } from "socket.io-client";

const URL = "http://localhost:5000";
// auto connect false
// We will manually call socket.connect() later, once the user has selected a username.
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log("event :");
  console.log(event, args);
});

export default socket;
