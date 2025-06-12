
import { Badge } from "@/components/ui/badge";

const conversations = [
  {
    id: 1,
    name: "دارلين ستيوارد",
    avatar: "د",
    avatarColor: "bg-orange-500",
    message: "لدي مشكلة في طلبي، هل يمكنك مساعدتي؟",
    time: "10:30 ص",
    unread: 2,
    status: "solving"
  },
  {
    id: 2,
    name: "جون سميث",
    avatar: "ج",
    avatarColor: "bg-blue-500",
    message: "شكرا لك على مساعدتك!",
    time: "9:45 ص",
    unread: 0,
    status: "solved"
  },
  {
    id: 3,
    name: "سارة ويلسون",
    avatar: "س",
    avatarColor: "bg-green-500",
    message: "متى ستصل طرديتي؟",
    time: "9:15 ص",
    unread: 1,
    status: "solving"
  },
  {
    id: 4,
    name: "مايك جونسون",
    avatar: "م",
    avatarColor: "bg-purple-500",
    message: "المنتج يعمل بشكل مثالي الآن",
    time: "8:30 ص",
    unread: 0,
    status: "solved"
  },
  {
    id: 5,
    name: "إيما ديفيس",
    avatar: "إ",
    avatarColor: "bg-pink-500",
    message: "أحتاج إلى تغيير عنوان الشحن",
    time: "أمس",
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{conversation.time}</span>
                <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">
                {conversation.message}
              </p>
              <div className="flex items-center justify-between">
                {conversation.unread > 0 && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {conversation.unread}
                  </Badge>
                )}
                <Badge 
                  variant={conversation.status === "solving" ? "destructive" : "default"}
                  className="text-xs"
                >
                  {conversation.status === "solving" ? "قيد الحل" : "محلولة"}
                </Badge>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full ${conversation.avatarColor} flex items-center justify-center text-white font-semibold flex-shrink-0`}>
              {conversation.avatar}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
