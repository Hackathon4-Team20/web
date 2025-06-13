import { useState, useEffect, useRef } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

const ClientChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io("http://localhost:3001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Listen for previous messages
    newSocket.on("previous-messages", (previousMessages: Message[]) => {
      console.log("Received previous messages:", previousMessages);
      setMessages(previousMessages);
    });

    // Listen for new messages
    newSocket.on("new-message", (receivedMessage: Message) => {
      console.log("Received new message:", receivedMessage);
      setMessages((prev) => [...prev, receivedMessage]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && socket && isConnected) {
      try {
        // Send message to AI model server for sentiment analysis (silently)
        await axios.post("http://127.0.0.1:5002/track", {
          message: message,
          timestamp: new Date().toISOString(),
        });

        // Send message to WebSocket server
        socket.emit("send-message", {
          text: message,
          sender: "client",
        });

        setMessage("");
      } catch (error) {
        console.error("Error analyzing sentiment:", error);
        // Still send the message even if sentiment analysis fails
        socket.emit("send-message", {
          text: message,
          sender: "client",
        });
        setMessage("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                م
              </div>
              <div>
                <h3 className="font-semibold">مركز الدعم الفني</h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "متصل" : "جاري الاتصال..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex justify-center mb-4">
              <div className="bg-muted rounded-lg p-4 max-w-[80%] text-right">
                <p className="text-center text-muted-foreground">
                  مرحباً بك في مركز الدعم الفني. كيف يمكننا مساعدتك اليوم؟
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "client" ? "justify-start" : "justify-end"
                } mb-4`}
              >
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    msg.sender === "client"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={isConnected ? "اكتب رسالة..." : "جاري الاتصال..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
                disabled={!isConnected}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                disabled={!isConnected}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
