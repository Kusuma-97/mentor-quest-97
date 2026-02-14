import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMentor, Interest, Level } from "@/lib/mentor-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code, Database, Brain, Palette, Smartphone, Shield, Sparkles } from "lucide-react";

const interests: { label: Interest; icon: React.ElementType; desc: string }[] = [
  { label: "Web Development", icon: Code, desc: "HTML, CSS, JS, React & more" },
  { label: "Data Science", icon: Database, desc: "Analytics, pandas, visualization" },
  { label: "Machine Learning", icon: Brain, desc: "Neural networks, NLP, CV" },
  { label: "UI/UX Design", icon: Palette, desc: "Figma, design systems, UX research" },
  { label: "Mobile Development", icon: Smartphone, desc: "React Native, Flutter, iOS/Android" },
  { label: "Cybersecurity", icon: Shield, desc: "Security, cryptography, pentesting" },
];

const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <header className="text-center py-16 px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">AI Mentor</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Your personalized AI-powered learning companion. Get guided roadmaps, interactive quizzes, and expert mentorship — all tailored to you.
        </p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-16 space-y-10">
        {/* Interest Selection */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">What do you want to learn?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.map(({ label, icon: Icon, desc }) => (
              <Card
                key={label}
                onClick={() => setSelectedInterest(label)}
                className={`cursor-pointer p-5 transition-all hover:shadow-md ${
                  selectedInterest === label
                    ? "ring-2 ring-primary shadow-md"
                    : "hover:border-primary/30"
                }`}
              >
                <Icon className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-medium text-foreground">{label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Level Picker */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Your skill level</h2>
          <div className="flex gap-3 flex-wrap">
            {levels.map((l) => (
              <Button
                key={l}
                variant={selectedLevel === l ? "default" : "outline"}
                onClick={() => setSelectedLevel(l)}
                className="px-6"
              >
                {l}
              </Button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full sm:w-auto px-10"
          disabled={!selectedInterest || !selectedLevel}
          onClick={handleStart}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Start Learning
        </Button>
      </main>
    </div>
  );
}
