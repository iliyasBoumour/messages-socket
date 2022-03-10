const io = require("./index");

// we register a middleware which checks the username and allows the connection
io.use((socket, next) => {
  const username = socket.handshake.auth.name;
  const id = Date.now();
  if (!username) {
    return next(new Error("invalid username"));
  }
  // The username is added as an attribute of the socket object
  socket.username = username;
  // socket.userID = Date.now();
  next();
});

// on connection, we send all existing users to the client:
// and We also notify the existing users that someone has been connected
io.on("connection", (socket) => {
  const users = [];
  // the io.of("/").sockets object, is a Map of all currently connected Socket instances, indexed by id
  console.log("opened sockets list");
  for (let [id, socket] of io.of("/").sockets) {
    // socket id and the attribute that we added
    console.log(id, socket.username);
    users.push({
      socketID: id,
      // userID: socket.userID,
      username: socket.username,
    });
  }
  socket.emit("users", users);

  // notify existing users when someone connected
  socket.broadcast.emit("user connected", {
    socketID: socket.id,
    // userID: socket.userID,
    username: socket.username,
  });

  // on sending a private message
  socket.on("private message", (msg) => {
    console.log(msg);
    socket.to(msg.to).emit("private message", msg);
  });
});
