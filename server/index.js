import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://localhost:8083",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Store messages in memory (in a real app, you'd use a database)
const messages = [];

// Arabic sentiment analysis word lists
const arabicPositiveWords = [
  "ممتاز",
  "رائع",
  "جيد",
  "حسن",
  "مشكور",
  "شكرا",
  "سعيد",
  "سعادة",
  "مبهر",
  "جميل",
  "عظيم",
  "ممتازة",
  "رائعة",
  "جيدة",
  "حسنة",
  "مشكورة",
  "شكراً",
  "سعيدة",
  "مبهرة",
  "جميلة",
  "عظيمة",
  "أحسن",
  "أفضل",
  "ممتازين",
  "رائعين",
  "جيدين",
  "حسنين",
  "مشكورين",
  "شاكرين",
  "سعداء",
  "مبهرين",
  "جميلين",
  "عظيمين",
];

const arabicNegativeWords = [
  "سيء",
  "رديء",
  "مزعج",
  "مؤلم",
  "محرج",
  "مخيب",
  "مخيب للآمال",
  "سيئة",
  "رديئة",
  "مزعجة",
  "مؤلمة",
  "محرجة",
  "مخيبة",
  "مخيبة للآمال",
  "سيئين",
  "رديئين",
  "مزعجين",
  "مؤلمين",
  "محرجين",
  "مخيبين",
  "مخيبين للآمال",
  "غاضب",
  "غاضبة",
  "غاضبين",
  "محبط",
  "محبطة",
  "محبطين",
  "مستاء",
  "مستاءة",
  "مستائين",
  "مستاءين",
  "مستاءات",
  "مستاءات",
  "مستاءات",
];

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach((word) => {
    if (arabicPositiveWords.includes(word)) positiveCount++;
    if (arabicNegativeWords.includes(word)) negativeCount++;
  });

  const total = positiveCount + negativeCount;
  if (total === 0) {
    return {
      score: 0,
      label: "محايد",
    };
  }

  const score = ((positiveCount - negativeCount) / total) * 100;

  if (score > 20) {
    return {
      score: Math.abs(score),
      label: "إيجابي",
    };
  } else if (score < -20) {
    return {
      score: Math.abs(score),
      label: "سلبي",
    };
  } else {
    return {
      score: Math.abs(score),
      label: "محايد",
    };
  }
}

io.on("connection", (socket) => {
  console.log("Client connected");

  // Send existing messages to newly connected clients
  socket.emit("previous-messages", messages);

  // Handle new messages
  socket.on("send-message", (message) => {
    console.log("Received message:", message);
    // Only analyze sentiment for client messages
    const sentiment =
      message.sender === "client" ? analyzeSentiment(message.text) : null;
    const newMessage = {
      id: Date.now(),
      text: message.text,
      sender: message.sender,
      timestamp: new Date().toISOString(),
      sentiment: sentiment,
    };

    console.log("Sending message with sentiment:", newMessage);
    messages.push(newMessage);
    io.emit("new-message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
