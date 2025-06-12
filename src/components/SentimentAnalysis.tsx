import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { io, Socket } from "socket.io-client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  sentiment: {
    score: number;
    label: string;
  };
}

interface SentimentResult {
  score: number;
  label: string;
  color: string;
  icon: JSX.Element;
}

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
  "مستاءات",
  "مستاءات",
];

const analyzeSentiment = (text: string): SentimentResult => {
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach((word) => {
    if (arabicPositiveWords.includes(word)) positiveCount++;
    if (arabicNegativeWords.includes(word)) negativeCount++;
  });

  const total = positiveCount + negativeCount;
  if (total === 0) {
    return {
      score: 0,
      label: "محايد",
      color: "bg-yellow-500",
      icon: <Minus className="h-4 w-4" />,
    };
  }

  const score = ((positiveCount - negativeCount) / total) * 100;

  if (score > 20) {
    return {
      score,
      label: "إيجابي",
      color: "bg-green-500",
      icon: <TrendingUp className="h-4 w-4" />,
    };
  } else if (score < -20) {
    return {
      score,
      label: "سلبي",
      color: "bg-red-500",
      icon: <TrendingDown className="h-4 w-4" />,
    };
  } else {
    return {
      score,
      label: "محايد",
      color: "bg-yellow-500",
      icon: <Minus className="h-4 w-4" />,
    };
  }
};

const getSentimentResult = (sentiment: {
  score: number;
  label: string;
}): SentimentResult => {
  const getIcon = (label: string) => {
    switch (label) {
      case "إيجابي":
        return <TrendingUp className="h-4 w-4" />;
      case "سلبي":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getColor = (label: string) => {
    switch (label) {
      case "إيجابي":
        return "bg-emerald-500";
      case "سلبي":
        return "bg-rose-500";
      default:
        return "bg-yellow-500";
    }
  };

  return {
    score: Math.abs(sentiment.score),
    label: sentiment.label,
    color: getColor(sentiment.label),
    icon: getIcon(sentiment.label),
  };
};

const SentimentAnalysis = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<SentimentResult>({
    score: 0,
    label: "محايد",
    color: "bg-yellow-500",
    icon: <Minus className="h-4 w-4" />,
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io("http://localhost:3000", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Sentiment Analysis connected to WebSocket server");
    });

    newSocket.on("previous-messages", (previousMessages: Message[]) => {
      console.log("Received previous messages:", previousMessages);
      setMessages(previousMessages);
    });

    newSocket.on("new-message", (message: Message) => {
      console.log("Received new message:", message);
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Filter only client messages for sentiment analysis
    const clientMessages = messages.filter(
      (msg) => msg.sender === "client" && msg.sentiment
    );

    if (clientMessages.length > 0) {
      // Calculate overall sentiment based on client messages only
      const sentiments = clientMessages.map((msg) => msg.sentiment);
      const totalScore = sentiments.reduce((acc, curr) => acc + curr.score, 0);
      const averageScore = totalScore / clientMessages.length;

      const overallSentimentResult = getSentimentResult({
        score: averageScore,
        label:
          averageScore > 20 ? "إيجابي" : averageScore < -20 ? "سلبي" : "محايد",
      });

      setOverallSentiment(overallSentimentResult);
    }
  }, [messages]);

  // Get only negative messages from the active client
  const negativeMessages = messages.filter(
    (msg) => msg.sender === "client" && msg.sentiment?.label === "سلبي"
  );

  // Prepare data for the pie chart
  const pieData = [
    {
      name: "إيجابي",
      value: messages.filter(
        (m) => m.sender === "client" && m.sentiment?.label === "إيجابي"
      ).length,
      color: "#10b981", // emerald-500
    },
    {
      name: "محايد",
      value: messages.filter(
        (m) => m.sender === "client" && m.sentiment?.label === "محايد"
      ).length,
      color: "#eab308", // yellow-500
    },
    {
      name: "سلبي",
      value: messages.filter(
        (m) => m.sender === "client" && m.sentiment?.label === "سلبي"
      ).length,
      color: "#f43f5e", // rose-500
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm">العدد: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-80 border-r border-border bg-card p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            تحليل مشاعر العملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Sentiment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">الحالة العامة</span>
                <div className="flex items-center gap-2">
                  {overallSentiment.icon}
                  <span className="text-sm">{overallSentiment.label}</span>
                </div>
              </div>
              <Progress
                value={Math.abs(overallSentiment.score)}
                className={overallSentiment.color}
              />
            </div>

            {/* Sentiment Pie Chart */}
            <div className="space-y-2">
              <span className="text-sm font-medium">توزيع المشاعر</span>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span className="text-sm">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Negative Messages */}
            <div className="space-y-2">
              <span className="text-sm font-medium">الرسائل السلبية</span>
              <ScrollArea className="h-[300px] rounded-md border p-2">
                <div className="space-y-2">
                  {negativeMessages.length > 0 ? (
                    negativeMessages.reverse().map((message) => {
                      const sentiment = getSentimentResult(message.sentiment);
                      return (
                        <div
                          key={message.id}
                          className="p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                            <div className="flex items-center gap-1">
                              {sentiment.icon}
                              <span className="text-xs font-medium text-rose-600">
                                {sentiment.label}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm">{message.text}</p>
                          <div className="mt-2">
                            <Progress
                              value={Math.abs(message.sentiment.score)}
                              className="bg-rose-100 [&>div]:bg-rose-500"
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      لا توجد رسائل سلبية
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
