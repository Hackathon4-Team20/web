import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3002",
      "http://localhost:3001",
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

// Arabic positive and negative word lists
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
];

// Function to analyze sentiment using AI model server
async function analyzeSentiment(text) {
  try {
    // Try to parse the text as JSON if it's a JSON string
    let parsedText = text;
    try {
      if (text.trim().startsWith("{")) {
        parsedText = JSON.parse(text);
      }
    } catch (e) {
      // If parsing fails, use the original text
      parsedText = text;
    }

    // If the text is a JSON object with sentiment data, use it directly
    if (typeof parsedText === "object" && parsedText !== null) {
      const { status, updated_score, reason } = parsedText;
      let label;
      let score;

      switch (status) {
        case "راضٍ":
          label = "إيجابي";
          score = updated_score * 20;
          break;
        case "غير راضٍ":
          label = "سلبي";
          score = -(updated_score * 20);
          break;
        case "محايد":
          label = "محايد";
          score = 0;
          break;
        default:
          label = "محايد";
          score = 0;
      }

      return {
        score: score,
        label: label,
        reason: reason || "لا يوجد سبب محدد",
      };
    }

    // If not a JSON object, analyze text locally
    const words = text.split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    // Check for positive and negative words
    words.forEach((word) => {
      if (arabicPositiveWords.includes(word)) positiveCount++;
      if (arabicNegativeWords.includes(word)) negativeCount++;
    });

    // If no sentiment words found, return neutral
    if (positiveCount === 0 && negativeCount === 0) {
      return {
        score: 0,
        label: "محايد",
        reason: "لا تحتوي الرسالة على مؤشرات لرضا أو عدم رضا",
      };
    }

    // Calculate sentiment score
    const total = positiveCount + negativeCount;
    const score = ((positiveCount - negativeCount) / total) * 100;

    // Determine sentiment based on score
    if (score > 20) {
      return {
        score: Math.min(Math.abs(score), 100),
        label: "إيجابي",
        reason:
          positiveCount > 1
            ? `تحتوي الرسالة على ${positiveCount} كلمات إيجابية`
            : "تحتوي الرسالة على كلمة إيجابية",
      };
    } else if (score < -20) {
      return {
        score: Math.min(Math.abs(score), 100),
        label: "سلبي",
        reason:
          negativeCount > 1
            ? `تحتوي الرسالة على ${negativeCount} كلمات سلبية`
            : "تحتوي الرسالة على كلمة سلبية",
      };
    } else {
      return {
        score: 0,
        label: "محايد",
        reason: "الرسالة محايدة",
      };
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return {
      score: 0,
      label: "محايد",
      reason: "حدث خطأ في تحليل المشاعر",
    };
  }
}

io.on("connection", (socket) => {
  console.log("Client connected");

  // Send existing messages to newly connected clients
  socket.emit("previous-messages", messages);

  // Handle new messages
  socket.on("send-message", async (message) => {
    console.log("Received message:", message);
    // Only analyze sentiment for client messages
    const sentiment =
      message.sender === "client" ? await analyzeSentiment(message.text) : null;
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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
