
const messages = [
  {
    id: 1,
    sender: "customer",
    content: "Hi, I have a problem with my recent order. The product I received doesn't match what I ordered.",
    time: "10:25 AM",
    avatar: "D",
    avatarColor: "bg-orange-500"
  },
  {
    id: 2,
    sender: "admin",
    content: "Hello! I'm sorry to hear about the issue with your order. I'd be happy to help you resolve this. Can you please provide me with your order number?",
    time: "10:26 AM"
  },
  {
    id: 3,
    sender: "customer",
    content: "Sure, my order number is #12345. I ordered a blue shirt but received a red one instead.",
    time: "10:27 AM",
    avatar: "D",
    avatarColor: "bg-orange-500"
  },
  {
    id: 4,
    sender: "admin",
    content: "Thank you for providing the order details. I can see the issue in our system. We'll arrange for the correct blue shirt to be sent to you immediately, and you can keep the red shirt as our apology for the inconvenience.",
    time: "10:29 AM"
  },
  {
    id: 5,
    sender: "customer",
    content: "That's very generous, thank you! When can I expect the correct item to arrive?",
    time: "10:30 AM",
    avatar: "D",
    avatarColor: "bg-orange-500"
  }
];

const ChatMessages = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.sender === "admin" ? "justify-end" : ""}`}
        >
          {message.sender === "customer" && (
            <div className={`w-8 h-8 rounded-full ${message.avatarColor} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
              {message.avatar}
            </div>
          )}
          <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === "admin" ? "order-first" : ""}`}>
            <div
              className={`p-3 rounded-lg ${
                message.sender === "admin"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            <p className={`text-xs text-muted-foreground mt-1 ${message.sender === "admin" ? "text-right" : ""}`}>
              {message.time}
            </p>
          </div>
          {message.sender === "admin" && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
              A
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
