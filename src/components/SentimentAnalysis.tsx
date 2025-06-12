
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SentimentAnalysis = () => {
  const overallSentiment = {
    score: 0.65,
    label: "إيجابي",
    trend: "improving"
  };

  const messageAnalysis = [
    {
      id: 1,
      message: "لدي مشكلة في طلبي الأخير...",
      sentiment: "negative",
      score: -0.4,
      keywords: ["مشكلة", "لا يطابق"]
    },
    {
      id: 2,
      message: "آسف لسماع هذه المشكلة...",
      sentiment: "neutral",
      score: 0.1,
      keywords: ["آسف", "مساعدة"]
    },
    {
      id: 3,
      message: "بالطبع، رقم طلبي هو #12345...",
      sentiment: "neutral",
      score: 0.0,
      keywords: ["رقم الطلب"]
    },
    {
      id: 4,
      message: "شكرا لك لتقديم التفاصيل...",
      sentiment: "positive",
      score: 0.7,
      keywords: ["شكرا", "سنرتب", "اعتذار"]
    },
    {
      id: 5,
      message: "هذا كريم جدا منكم، شكرا!",
      sentiment: "positive",
      score: 0.8,
      keywords: ["كريم", "شكرا"]
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "إيجابي";
      case "negative":
        return "سلبي";
      default:
        return "محايد";
    }
  };

  return (
    <div className="w-80 border-r border-border bg-card p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">تحليل المشاعر</h2>
          <AlertTriangle className="h-5 w-5 text-primary" />
        </div>

        {/* Overall Sentiment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">إجمالي المحادثة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={getSentimentColor(overallSentiment.label.toLowerCase())}>
                {overallSentiment.label}
              </Badge>
              <span className="text-sm text-muted-foreground">المشاعر</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{overallSentiment.score}</span>
              <span className="text-sm text-muted-foreground">النتيجة</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  overallSentiment.score > 0 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.abs(overallSentiment.score) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Message-by-Message Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">تحليل الرسائل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messageAnalysis.map((analysis) => (
              <div key={analysis.id} className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  {getSentimentIcon(analysis.sentiment)}
                  <p className="text-xs text-muted-foreground truncate flex-1 text-right">
                    {analysis.message}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">
                    {analysis.score > 0 ? "+" : ""}{analysis.score}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSentimentColor(analysis.sentiment)}`}
                  >
                    {getSentimentLabel(analysis.sentiment)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">نظرات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">تحسن رضا العملاء</span>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">الحل قيد التنفيذ</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">كلمات مفتاحية: طلب، مشكلة، مساعدة</span>
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
