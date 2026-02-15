import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMentor, Interest, Level } from "@/lib/mentor-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, Database, Brain, Palette, Smartphone, Shield, Sparkles } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";

const interests: { label: Interest; icon: React.ElementType; desc: string }[] = [
  { label: "Web Development", icon: Code, desc: "HTML, CSS, JS, React & more" },
  { label: "Data Science", icon: Database, desc: "Analytics, pandas, visualization" },
  { label: "Machine Learning", icon: Brain, desc: "Neural networks, NLP, CV" },
  { label: "UI/UX Design", icon: Palette, desc: "Figma, design systems, UX research" },
  { label: "Mobile Development", icon: Smartphone, desc: "React Native, Flutter, iOS/Android" },
  { label: "Cybersecurity", icon: Shield, desc: "Security, cryptography, pentesting" },
];

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function Onboarding() {
  const { setInterest, setLevel } = useMentor();
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!selectedInterest || !selectedLevel) return;
    setInterest(selectedInterest);
    setLevel(selectedLevel);
    navigate("/dashboard");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Hero */}
        <motion.header className="text-center py-16 px-4" variants={fadeUp} initial="initial" animate="animate">
          <div className="flex items-center justify-center gap-2 mb-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">AI Mentor</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your personalized AI-powered learning companion. Get guided roadmaps, interactive quizzes, and expert mentorship — all tailored to you.
          </p>
        </motion.header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-16 space-y-10">
          {/* Interest Selection */}
          <motion.section variants={fadeUp} initial="initial" animate="animate">
            <h2 className="text-xl font-semibold text-foreground mb-4">What do you want to learn?</h2>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="initial" animate="animate">
              {interests.map(({ label, icon: Icon, desc }) => (
                <motion.div key={label} variants={fadeUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    onClick={() => setSelectedInterest(label)}
                    className={`cursor-pointer p-5 transition-shadow hover:shadow-md ${
                      selectedInterest === label
                        ? "ring-2 ring-primary shadow-md"
                        : "hover:border-primary/30"
                    }`}
                  >
                    <Icon className="h-6 w-6 text-primary mb-2" />
                    <h3 className="font-medium text-foreground">{label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Level Picker */}
          <motion.section variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.15 }}>
            <h2 className="text-xl font-semibold text-foreground mb-4">Your skill level</h2>
            <div className="flex gap-3 flex-wrap">
              {levels.map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                  <Button
                    variant={selectedLevel === l ? "default" : "outline"}
                    onClick={() => setSelectedLevel(l)}
                    className="px-6"
                  >
                    {l}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Button
              size="lg"
              className="w-full sm:w-auto px-10"
              disabled={!selectedInterest || !selectedLevel}
              onClick={handleStart}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Learning
            </Button>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
