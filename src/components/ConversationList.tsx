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
  activeTab: string;
  selectedChat: number;
  onSelectChat: (chatId: number) => void;
}

const ConversationList = ({
  activeTab,
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
    const newSocket = io("http://localhost:3001", {
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
    <ScrollArea className="h-[calc(100vh-200px)]" dir="rtl">
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectChat(conversation.id)}
            className={`w-full py-5 px-2 rounded-lg transition-colors ${
              selectedChat === conversation.id
                ? "bg-primary/10 hover:bg-primary/20"
                : "hover:bg-accent"
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                {conversation.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium truncate text-right text-sm">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 mr-2">
                      {conversation.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <p
                      className={`text-xs truncate text-right ${
                        conversation.lastMessage.includes("سيء") ||
                        conversation.lastMessage.includes("مزعج") ||
                        conversation.lastMessage.includes("مخيب")
                          ? "text-rose-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {conversation.lastMessage || "لا توجد رسائل"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 mr-2 text-[10px]">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
