import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMentor } from "@/lib/mentor-context";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Map, HelpCircle, BarChart3, Home, User, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ChatTab from "@/components/dashboard/ChatTab";
import RoadmapTab from "@/components/dashboard/RoadmapTab";
import QuizTab from "@/components/dashboard/QuizTab";
import ProgressTab from "@/components/dashboard/ProgressTab";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-48 gradient-primary opacity-5 blur-2xl pointer-events-none" />

        {/* Header */}
        <motion.header
          className="border-b bg-card/80 backdrop-blur-md px-4 py-3 flex items-center justify-between relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-xl font-bold gradient-text"
            whileHover={{ scale: 1.03 }}
          >
            AI Mentor
          </motion.h1>
          <div className="flex items-center gap-2">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <Badge className="gradient-primary text-primary-foreground border-0">{interest}</Badge>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
              <Badge variant="outline" className="border-primary/30 text-primary">{level}</Badge>
            </motion.div>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button onClick={() => navigate("/")} className="ml-2 text-muted-foreground hover:text-primary transition-colors" whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                  <Home className="h-4 w-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-primary transition-colors" whileHover={{ scale: 1.15, rotate: -5 }} whileTap={{ scale: 0.9 }}>
                  <User className="h-4 w-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button onClick={() => { signOut(); navigate("/auth"); }} className="text-muted-foreground hover:text-destructive transition-colors" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </div>
        </motion.header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 py-6 relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <TabsList className="w-full justify-start mb-6 bg-card/60 backdrop-blur-sm p-1.5 border border-border/50">
                {[
                  { value: "chat", icon: MessageSquare, label: "Chat" },
                  { value: "roadmap", icon: Map, label: "Roadmap" },
                  { value: "quiz", icon: HelpCircle, label: "Quiz" },
                  { value: "progress", icon: BarChart3, label: "Progress" },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger key={value} value={value} className="gap-1.5 relative data-[state=active]:text-primary-foreground transition-all">
                    <Icon className="h-4 w-4" />
                    {label}
                    {activeTab === value && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 rounded-md gradient-primary -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
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
