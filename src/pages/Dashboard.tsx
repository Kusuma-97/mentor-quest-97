import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMentor } from "@/lib/mentor-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Map, HelpCircle, BarChart3, Settings } from "lucide-react";
import ChatTab from "@/components/dashboard/ChatTab";
import RoadmapTab from "@/components/dashboard/RoadmapTab";
import QuizTab from "@/components/dashboard/QuizTab";
import ProgressTab from "@/components/dashboard/ProgressTab";

export default function Dashboard() {
  const { interest, level } = useMentor();
  const navigate = useNavigate();

  useEffect(() => {
    if (!interest || !level) navigate("/");
  }, [interest, level, navigate]);

  if (!interest || !level) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">AI Mentor</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{interest}</Badge>
          <Badge variant="outline">{level}</Badge>
          <button onClick={() => navigate("/")} className="ml-2 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="chat" className="gap-1.5"><MessageSquare className="h-4 w-4" />Chat</TabsTrigger>
            <TabsTrigger value="roadmap" className="gap-1.5"><Map className="h-4 w-4" />Roadmap</TabsTrigger>
            <TabsTrigger value="quiz" className="gap-1.5"><HelpCircle className="h-4 w-4" />Quiz</TabsTrigger>
            <TabsTrigger value="progress" className="gap-1.5"><BarChart3 className="h-4 w-4" />Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="chat"><ChatTab /></TabsContent>
          <TabsContent value="roadmap"><RoadmapTab /></TabsContent>
          <TabsContent value="quiz"><QuizTab /></TabsContent>
          <TabsContent value="progress"><ProgressTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
