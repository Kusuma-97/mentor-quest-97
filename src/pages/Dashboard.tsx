import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMentor } from "@/lib/mentor-context";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Map, HelpCircle, BarChart3, Settings, LogOut } from "lucide-react";
import ChatTab from "@/components/dashboard/ChatTab";
import RoadmapTab from "@/components/dashboard/RoadmapTab";
import QuizTab from "@/components/dashboard/QuizTab";
import ProgressTab from "@/components/dashboard/ProgressTab";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Dashboard() {
  const { interest, level } = useMentor();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    if (!interest || !level) navigate("/");
  }, [interest, level, navigate]);

  if (!interest || !level) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.header
          className="border-b bg-card px-4 py-3 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-bold text-foreground">AI Mentor</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{interest}</Badge>
            <Badge variant="outline">{level}</Badge>
            <button onClick={() => navigate("/")} className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            <button onClick={() => { signOut(); navigate("/auth"); }} className="text-muted-foreground hover:text-foreground transition-colors" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </motion.header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="chat" className="gap-1.5"><MessageSquare className="h-4 w-4" />Chat</TabsTrigger>
              <TabsTrigger value="roadmap" className="gap-1.5"><Map className="h-4 w-4" />Roadmap</TabsTrigger>
              <TabsTrigger value="quiz" className="gap-1.5"><HelpCircle className="h-4 w-4" />Quiz</TabsTrigger>
              <TabsTrigger value="progress" className="gap-1.5"><BarChart3 className="h-4 w-4" />Progress</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="chat" forceMount={activeTab === "chat" ? true : undefined}>
                  {activeTab === "chat" && <ChatTab />}
                </TabsContent>
                <TabsContent value="roadmap" forceMount={activeTab === "roadmap" ? true : undefined}>
                  {activeTab === "roadmap" && <RoadmapTab />}
                </TabsContent>
                <TabsContent value="quiz" forceMount={activeTab === "quiz" ? true : undefined}>
                  {activeTab === "quiz" && <QuizTab />}
                </TabsContent>
                <TabsContent value="progress" forceMount={activeTab === "progress" ? true : undefined}>
                  {activeTab === "progress" && <ProgressTab />}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>
      </div>
    </PageTransition>
  );
}
