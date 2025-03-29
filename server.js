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
  const io = socketIo(httpServer, {
    cors: {
      origin: "*", // Allow cross-origin requests
      methods: ["GET", "POST"],
    },
  });

  let userCount = 0; // Track number of connected users

  io.on("connection", (socket) => {
    userCount++;
    console.log(`[SERVER] A user connected. Total users: ${userCount}`);

    // Emit updated user count to all clients
    io.emit("userCount", userCount);

    // Send a welcome message to the connected user
    socket.emit("message", { user: "System", text: "Welcome to the chat!" });

    // Listen for messages from the client
    socket.on("sendMessage", (message) => {
      console.log("[SERVER] Received message:", message);
      io.emit("receiveMessage", message); // Broadcast message to all clients
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      userCount = Math.max(0, userCount - 1);
      console.log(`[SERVER] A user disconnected. Total users: ${userCount}`);
      io.emit("userCount", userCount); // Emit updated user count
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
