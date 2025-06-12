
import { useState } from "react";
import { Search, MoreVertical, Send, Phone, Video, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConversationList from "./ConversationList";
import ChatMessages from "./ChatMessages";
import SentimentAnalysis from "./SentimentAnalysis";

const AdminChatInterface = () => {
  const [activeTab, setActiveTab] = useState("solving");
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Right Sentiment Analysis Panel */}
      <SentimentAnalysis />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المحادثة"
                  className="pr-10 h-9 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                د
              </div>
              <div>
                <h3 className="font-semibold">دارلين ستيوارد</h3>
                <p className="text-sm text-muted-foreground">متصل</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ChatMessages />

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="اكتب رسالة..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pl-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="w-80 border-l border-border bg-card">
        {/* Admin Profile Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-semibold text-sm">مدير</h3>
                <p className="text-xs text-muted-foreground">متصل</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                م
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المحادثات..."
              className="pr-10 h-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-4">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab("solved")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "solved"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              محلولة
            </button>
            <button
              onClick={() => setActiveTab("solving")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "solving"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              قيد الحل
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <ConversationList 
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>
    </div>
  );
};

export default AdminChatInterface;
