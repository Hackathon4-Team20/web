import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  sentiment?: {
    label: string;
  };
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ConversationListProps {
  selectedChat: number;
  onSelectChat: (id: number) => void;
}

const ConversationList = ({
  selectedChat,
  onSelectChat,
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "علي محمد",
      avatar: "ع",
      lastMessage: "",
      timestamp: "",
      unreadCount: 0,
    },
    {
      id: 2,
      name: "سارة أحمد",
      avatar: "س",
      lastMessage: "شكراً جزيلاً على المساعدة",
      timestamp: "09:45",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "محمد خالد",
      avatar: "م",
      lastMessage: "هل يمكنني الحصول على مزيد من المعلومات؟",
      timestamp: "09:30",
      unreadCount: 1,
    },
  ]);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("ConversationList connected to WebSocket server");
    });

    newSocket.on("previous-messages", (previousMessages: Message[]) => {
      if (previousMessages.length > 0) {
        const lastClientMessage = previousMessages
          .filter((msg) => msg.sender === "client")
          .pop();

        if (lastClientMessage) {
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === 1
                ? {
                    ...conv,
                    lastMessage: lastClientMessage.text,
                    timestamp: new Date(
                      lastClientMessage.timestamp
                    ).toLocaleTimeString(),
                    unreadCount: 0,
                  }
                : conv
            )
          );
        }
      }
    });

    newSocket.on("new-message", (message: Message) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === 1) {
            return {
              ...conv,
              lastMessage: message.text,
              timestamp: new Date(message.timestamp).toLocaleTimeString(),
              unreadCount:
                message.sender === "client" && selectedChat !== conv.id
                  ? conv.unreadCount + 1
                  : conv.unreadCount,
            };
          }
          return conv;
        })
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [selectedChat]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectChat(conversation.id)}
            className={`w-full p-3 rounded-lg transition-colors ${
              selectedChat === conversation.id
                ? "bg-primary/10 hover:bg-primary/20"
                : "hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {conversation.timestamp}
                  </span>
                  <h3 className="font-medium truncate">{conversation.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                  {conversation.unreadCount > 0 && (
                    <span className="mr-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                  <p
                    className={`text-sm truncate ${
                      conversation.lastMessage.includes("سيء") ||
                      conversation.lastMessage.includes("مزعج") ||
                      conversation.lastMessage.includes("مخيب")
                        ? "text-rose-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                {conversation.avatar}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
