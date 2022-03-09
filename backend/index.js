const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

// app.use("/", (req, res) => {
//   res.send("weee");
// });

server.listen(5000, () => {
  console.log("app listening ...");
});
module.exports = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
require("./socket");
