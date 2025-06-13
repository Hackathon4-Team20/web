import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Send, Search, Phone, Video, MoreVertical } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  sentiment?: {
    label: string;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSendMessage: () => void;
  message: string;
  setMessage: (message: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatMessages = ({
  messages,
  messagesEndRef,
  onSendMessage,
  message,
  setMessage,
  onKeyPress,
}: ChatMessagesProps) => {
  return (
    <>
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              ع
            </div>
            <div>
              <h3 className="font-semibold">علي محمد</h3>
              <p className="text-sm text-muted-foreground">متصل</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المحادثة"
                className="pr-10 h-9 w-64"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "admin" ? "justify-start" : "justify-end"
            } mb-4`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p
                className={`text-sm ${
                  message.sender === "client" &&
                  message.sentiment?.label === "سلبي"
                    ? "text-rose-600"
                    : ""
                }`}
              >
                {message.text}
              </p>
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="اكتب رسالة..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={onKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button size="icon" onClick={onSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChatMessages;
