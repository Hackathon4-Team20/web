
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SentimentAnalysis = () => {
  const overallSentiment = {
    score: 0.65,
    label: "Positive",
    trend: "improving"
  };

  const messageAnalysis = [
    {
      id: 1,
      message: "I have a problem with my recent order...",
      sentiment: "negative",
      score: -0.4,
      keywords: ["problem", "doesn't match"]
    },
    {
      id: 2,
      message: "I'm sorry to hear about the issue...",
      sentiment: "neutral",
      score: 0.1,
      keywords: ["sorry", "help"]
    },
    {
      id: 3,
      message: "Sure, my order number is #12345...",
      sentiment: "neutral",
      score: 0.0,
      keywords: ["order number"]
    },
    {
      id: 4,
      message: "Thank you for providing the details...",
      sentiment: "positive",
      score: 0.7,
      keywords: ["thank you", "arrange", "apology"]
    },
    {
      id: 5,
      message: "That's very generous, thank you!",
      sentiment: "positive",
      score: 0.8,
      keywords: ["generous", "thank you"]
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

  return (
    <div className="w-80 border-l border-border bg-card p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Sentiment Analysis</h2>
        </div>

        {/* Overall Sentiment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Overall Conversation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sentiment</span>
              <Badge className={getSentimentColor(overallSentiment.label.toLowerCase())}>
                {overallSentiment.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Score</span>
              <span className="font-semibold">{overallSentiment.score}</span>
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
            <CardTitle className="text-sm">Message Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messageAnalysis.map((analysis) => (
              <div key={analysis.id} className="space-y-2 p-3 bg-muted rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-muted-foreground truncate flex-1">
                    {analysis.message}
                  </p>
                  {getSentimentIcon(analysis.sentiment)}
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSentimentColor(analysis.sentiment)}`}
                  >
                    {analysis.sentiment}
                  </Badge>
                  <span className="text-xs font-mono">
                    {analysis.score > 0 ? "+" : ""}{analysis.score}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
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
            <CardTitle className="text-sm">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">Customer satisfaction improving</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-muted-foreground">Resolution in progress</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-muted-foreground">Keywords: order, problem, help</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
