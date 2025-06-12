
import { Badge } from "@/components/ui/badge";

const conversations = [
  {
    id: 1,
    name: "Darlene Steward",
    avatar: "D",
    avatarColor: "bg-orange-500",
    message: "I have a problem with my order, can you help me?",
    time: "10:30 AM",
    unread: 2,
    status: "solving"
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "J",
    avatarColor: "bg-blue-500",
    message: "Thank you for your help!",
    time: "9:45 AM",
    unread: 0,
    status: "solved"
  },
  {
    id: 3,
    name: "Sarah Wilson",
    avatar: "S",
    avatarColor: "bg-green-500",
    message: "When will my package arrive?",
    time: "9:15 AM",
    unread: 1,
    status: "solving"
  },
  {
    id: 4,
    name: "Mike Johnson",
    avatar: "M",
    avatarColor: "bg-purple-500",
    message: "The product works perfectly now",
    time: "8:30 AM",
    unread: 0,
    status: "solved"
  },
  {
    id: 5,
    name: "Emma Davis",
    avatar: "E",
    avatarColor: "bg-pink-500",
    message: "I need to change my shipping address",
    time: "Yesterday",
    unread: 3,
    status: "solving"
  }
];

interface ConversationListProps {
  selectedChat: number;
  onSelectChat: (chatId: number) => void;
}

const ConversationList = ({ selectedChat, onSelectChat }: ConversationListProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          onClick={() => onSelectChat(index)}
          className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
            selectedChat === index ? "bg-accent" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-full ${conversation.avatarColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
              {conversation.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                <span className="text-xs text-muted-foreground">{conversation.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">
                {conversation.message}
              </p>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={conversation.status === "solving" ? "destructive" : "default"}
                  className="text-xs"
                >
                  {conversation.status}
                </Badge>
                {conversation.unread > 0 && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
