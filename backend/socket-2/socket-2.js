const io = require("../index");
const { InMemorySessionStore } = require("./sessionStore");
const { uuid } = require("uuidv4");
const sessionStore = new InMemorySessionStore();

// sessionID will  authenticate the user upon reconnection
// userID will be used tp exchange messages
io.use((socket, next) => {
  console.log("call socket");
  const sessionID = socket.handshake.auth.sessionID;
  const session = sessionStore.findSession(sessionID);
  if (session) {
    console.log("has previous");
    socket.sessionID = sessionID;
    socket.userID = session.userID;
    socket.username = session.username;
    return next();
  }
  // don't have a previous sesssion
  const username = socket.handshake.auth.name;
  console.log(username);
  if (!username) {
    return next(new Error("invalid username"));
  }
  console.log("new one");
  // create new session
  socket.sessionID = uuid();
  socket.userID = uuid();
  socket.username = username;
  next();
});

// on connection, we send all existing users to the client:
// and We also notify the existing users that someone has been connected
io.on("connection", (socket) => {
  console.log("connection");

  // send session info to the client
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // join a room with name userid
  socket.join(socket.userID);

  const users = [];
  console.log(sessionStore.findAllSessions());
  sessionStore.findAllSessions().forEach((s) => {
    if (s.connected) {
      users.push({
        userID: s.userID,
        username: s.username,
        connected: s.connected,
      });
    }
  });
  socket.emit("users", users);

  // notify existing users when someone connected
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // on sending a private message
  socket.on("private message", (msg) => {
    // to himself send to other opened tabs (not the current)
    socket.to(msg.to).to(socket.userID).emit("private message", msg);
  });
  socket.on("disconnect", async () => {
    console.log("disconnect");
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      // sessionStore.removeSession(socket.sessionID);
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
    }
  });
});
