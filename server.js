// server.js
const express = require("express");
const http = require("http");
const next = require("next");
const socketIo = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Send a welcome message to the connected user
    socket.emit("message", { user: "System", text: "Welcome to the chat!" });

    // Listen for messages from the client
    socket.on("sendMessage", (message) => {
      console.log("Received message: ", message);
      // Broadcast the message to all connected clients
      io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  // Handle all other requests
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const port = process.env.PORT || 3000;
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
