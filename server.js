require("dotenv").config({ path: ".env.local" }); // Load environment variables

const express = require("express");
const http = require("http");
const next = require("next");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/Message"); // Import the Message model

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Ensure the MongoDB URI includes the database name "chat"
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/chat";

if (!mongoUri) {
  console.error("Error: MONGODB_URI is not defined in the environment variables.");
  process.exit(1); // Exit the process if the MongoDB URI is missing
}

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  });

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

    // Retrieve the last 50 messages from MongoDB and send them to the connected user
    socket.on("loadMessages", async () => {
      try {
        const recentMessages = await Message.find()
          .sort({ timestamp: -1 })
          .limit(50)
          .exec();

        // Send messages in reverse order (oldest first)
        socket.emit("loadMessages", recentMessages.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    // Listen for messages from the client
    socket.on("sendMessage", async (message) => {
      console.log("[SERVER] Received message:", message);

      // Validate the message object
      if (!message.user || !message.text) {
        console.error("[SERVER] Invalid message object:", message);
        return;
      }

      // Save the message to the database
      const newMessage = new Message({
        user: message.user,
        text: message.text,
        timestamp: message.timestamp || Date.now(),
      });

      try {
        const savedMessage = await newMessage.save();
        console.log("[SERVER] Message saved to database:", savedMessage);

        // Broadcast the message to all clients
        io.emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("[SERVER] Error saving message:", error.message);
      }
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
