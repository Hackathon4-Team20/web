import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">
          مرحباً بك في نظام تحليل المحادثات
        </h1>
        <p className="text-lg text-muted-foreground">
          اختر الواجهة التي تريد استخدامها
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/client")}
            className="px-8"
          >
            واجهة المستخدم
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/admin")}
            className="px-8"
          >
            لوحة التحكم
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
