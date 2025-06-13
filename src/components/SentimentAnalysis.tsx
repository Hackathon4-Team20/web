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
    reason: string;
  };
}

interface SentimentResult {
  score: number;
  label: string;
  color: string;
  icon: JSX.Element;
  reason: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
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
];

const analyzeSentiment = (text: string): SentimentResult => {
  const words = text.split(/\s+/);
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
      reason: "",
    };
  }

  const score = ((positiveCount - negativeCount) / total) * 100;

  if (score > 20) {
    return {
      score: Math.min(Math.abs(score), 100),
      label: "إيجابي",
      color: "bg-green-500",
      icon: <TrendingUp className="h-4 w-4" />,
      reason: "",
    };
  } else if (score < -20) {
    return {
      score: Math.min(Math.abs(score), 100),
      label: "سلبي",
      color: "bg-red-500",
      icon: <TrendingDown className="h-4 w-4" />,
      reason: "",
    };
  } else {
    return {
      score: Math.min(Math.abs(score), 100),
      label: "محايد",
      color: "bg-yellow-500",
      icon: <Minus className="h-4 w-4" />,
      reason: "",
    };
  }
};

const getSentimentResult = (sentiment: {
  score: number;
  label: string;
  reason: string;
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
        return "bg-green-500";
      case "سلبي":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  // Convert the score to a percentage for display
  const displayScore = Math.abs(sentiment.score);
  const normalizedScore = Math.min(displayScore, 100);

  return {
    score: normalizedScore,
    label: sentiment.label,
    color: getColor(sentiment.label),
    icon: getIcon(sentiment.label),
    reason: sentiment.reason,
  };
};

const SentimentAnalysis = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [overallSentiment, setOverallSentiment] = useState<SentimentResult>({
    score: 0,
    label: "محايد",
    color: "bg-yellow-500",
    icon: <Minus className="h-4 w-4" />,
    reason: "لا توجد رسائل",
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  // Calculate sentiment trends
  const calculateSentimentTrends = (messages: Message[]) => {
    const clientMessages = messages.filter(
      (msg) => msg.sender === "client" && msg.sentiment
    );

    // Group messages by sentiment
    const sentimentGroups = {
      positive: clientMessages.filter((m) => m.sentiment.label === "إيجابي"),
      neutral: clientMessages.filter((m) => m.sentiment.label === "محايد"),
      negative: clientMessages.filter((m) => m.sentiment.label === "سلبي"),
    };

    // Calculate weighted scores
    const positiveScore = sentimentGroups.positive.reduce(
      (acc, curr) => acc + curr.sentiment.score,
      0
    );
    const negativeScore = sentimentGroups.negative.reduce(
      (acc, curr) => acc + Math.abs(curr.sentiment.score),
      0
    );
    const neutralCount = sentimentGroups.neutral.length;

    // Calculate overall sentiment
    const totalMessages = clientMessages.length;
    if (totalMessages === 0) return { score: 0, label: "محايد" };

    const weightedScore = (positiveScore - negativeScore) / totalMessages;
    const label =
      weightedScore > 20 ? "إيجابي" : weightedScore < -20 ? "سلبي" : "محايد";

    return {
      score: Math.min(Math.abs(weightedScore), 100),
      label,
      trends: {
        positive: sentimentGroups.positive.length,
        neutral: neutralCount,
        negative: sentimentGroups.negative.length,
      },
    };
  };

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io("http://localhost:3001", {
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
      // Get all messages for comprehensive analysis
      const allMessages = clientMessages;

      // Calculate sentiment statistics
      const sentimentStats = {
        positive: allMessages.filter((msg) => msg.sentiment.label === "إيجابي")
          .length,
        negative: allMessages.filter((msg) => msg.sentiment.label === "سلبي")
          .length,
        neutral: allMessages.filter((msg) => msg.sentiment.label === "محايد")
          .length,
        total: allMessages.length,
      };

      // Calculate sentiment percentages
      const percentages = {
        positive: (sentimentStats.positive / sentimentStats.total) * 100,
        negative: (sentimentStats.negative / sentimentStats.total) * 100,
        neutral: (sentimentStats.neutral / sentimentStats.total) * 100,
      };

      // Determine dominant sentiment based on highest percentage
      let dominantSentiment;
      let sentimentScore;

      if (
        percentages.positive > percentages.negative &&
        percentages.positive > percentages.neutral
      ) {
        dominantSentiment = "إيجابي";
        sentimentScore = percentages.positive;
      } else if (
        percentages.negative > percentages.positive &&
        percentages.negative > percentages.neutral
      ) {
        dominantSentiment = "سلبي";
        sentimentScore = percentages.negative;
      } else {
        dominantSentiment = "محايد";
        sentimentScore = percentages.neutral;
      }

      const overallSentimentResult = getSentimentResult({
        score: sentimentScore,
        label: dominantSentiment,
        reason: "",
      });

      setOverallSentiment(overallSentimentResult);
    }
  }, [messages]);

  // Get only negative messages from the active client
  const negativeMessages = messages.filter(
    (msg) => msg.sender === "client" && msg.sentiment?.label === "سلبي"
  );

  // Prepare data for the pie chart with weighted values
  const pieData = [
    {
      name: "إيجابي",
      value: messages
        .filter((m) => m.sender === "client" && m.sentiment?.label === "إيجابي")
        .reduce((acc, curr) => acc + Math.abs(curr.sentiment.score), 0),
      color: "#22c55e", // green-500
    },
    {
      name: "محايد",
      value: messages
        .filter((m) => m.sender === "client" && m.sentiment?.label === "محايد")
        .reduce((acc, curr) => acc + Math.abs(curr.sentiment.score), 0),
      color: "#eab308", // yellow-500
    },
    {
      name: "سلبي",
      value: messages
        .filter((m) => m.sender === "client" && m.sentiment?.label === "سلبي")
        .reduce((acc, curr) => acc + Math.abs(curr.sentiment.score), 0),
      color: "#ef4444", // red-500
    },
  ];

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
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
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-medium ${
                        overallSentiment.label === "إيجابي"
                          ? "text-green-500"
                          : overallSentiment.label === "سلبي"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {overallSentiment.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(overallSentiment.score)}%)
                    </span>
                  </div>
                </div>
              </div>
              <Progress
                value={Math.abs(overallSentiment.score)}
                className={`${overallSentiment.color} [&>div]:${overallSentiment.color}`}
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {sentiment.reason}
                          </p>
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
