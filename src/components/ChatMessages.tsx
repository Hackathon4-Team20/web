
const messages = [
  {
    id: 1,
    sender: "customer",
    content: "مرحبا، لدي مشكلة في طلبي الأخير. المنتج الذي استلمته لا يطابق ما طلبته.",
    time: "10:25 ص",
    avatar: "د",
    avatarColor: "bg-orange-500"
  },
  {
    id: 2,
    sender: "admin",
    content: "مرحبا! آسف لسماع هذه المشكلة مع طلبك. سأكون سعيدا لمساعدتك في حل هذا الأمر. هل يمكنك من فضلك تزويدي برقم طلبك؟",
    time: "10:26 ص"
  },
  {
    id: 3,
    sender: "customer",
    content: "بالطبع، رقم طلبي هو #12345. طلبت قميصا أزرق لكن استلمت قميصا أحمر بدلا من ذلك.",
    time: "10:27 ص",
    avatar: "د",
    avatarColor: "bg-orange-500"
  },
  {
    id: 4,
    sender: "admin",
    content: "شكرا لك لتقديم تفاصيل الطلب. يمكنني رؤية المشكلة في نظامنا. سنرتب لإرسال القميص الأزرق الصحيح إليك على الفور، ويمكنك الاحتفاظ بالقميص الأحمر كاعتذار منا عن الإزعاج.",
    time: "10:29 ص"
  },
  {
    id: 5,
    sender: "customer",
    content: "هذا كريم جدا منكم، شكرا لكم! متى يمكنني توقع وصول العنصر الصحيح؟",
    time: "10:30 ص",
    avatar: "د",
    avatarColor: "bg-orange-500"
  }
];

const ChatMessages = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.sender === "admin" ? "justify-start" : "justify-end"}`}
        >
          {message.sender === "admin" && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
              م
            </div>
          )}
          <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === "customer" ? "order-first" : ""}`}>
            <div
              className={`p-3 rounded-lg ${
                message.sender === "customer"
                  ? "bg-primary text-primary-foreground mr-auto"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            <p className={`text-xs text-muted-foreground mt-1 ${message.sender === "customer" ? "text-left" : "text-right"}`}>
              {message.time}
            </p>
          </div>
          {message.sender === "customer" && (
            <div className={`w-8 h-8 rounded-full ${message.avatarColor} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
              {message.avatar}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
