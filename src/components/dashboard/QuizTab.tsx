import { useState } from "react";
import { useMentor } from "@/lib/mentor-context";
import { invokeFunction } from "@/lib/ai-stream";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function QuizTab() {
  const { interest, level, addQuizResult } = useMentor();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const data = await invokeFunction<{ questions: Question[]; topic: string }>("quiz", { interest, level });
      setQuestions(data.questions);
      setTopic(data.topic);
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      const finalScore = selected === questions[current].correct ? score + 0 : score; // already counted
      setFinished(true);
      addQuizResult({ topic, score: finalScore || score, total: questions.length, timestamp: Date.now() });
    }
  };

  if (questions.length === 0 || finished) {
    return (
      <div className="text-center py-20">
        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        {finished ? (
          <>
            <h2 className="text-xl font-semibold text-foreground mb-2">Quiz Complete!</h2>
            <p className="text-lg text-muted-foreground mb-1">Topic: {topic}</p>
            <p className="text-2xl font-bold text-foreground mb-6">{score}/{questions.length} correct</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-foreground mb-2">Test Your Knowledge</h2>
            <p className="text-muted-foreground mb-6">AI-generated quiz on {interest} for {level} level.</p>
          </>
        )}
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {finished ? "New Quiz" : "Start Quiz"}
        </Button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {current + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {q.options.map((opt, i) => {
            let variant: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link" = "outline";
            let icon = null;
            if (selected !== null) {
              if (i === q.correct) { variant = "default"; icon = <CheckCircle className="h-4 w-4" />; }
              else if (i === selected) { icon = <XCircle className="h-4 w-4" />; }
            }
            return (
              <Button
                key={i}
                variant={variant}
                className={`w-full justify-start text-left gap-2 ${selected !== null && i === selected && i !== q.correct ? "border-destructive text-destructive" : ""}`}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
              >
                {icon}
                {opt}
              </Button>
            );
          })}
          {selected !== null && (
            <div className="mt-4 p-3 rounded-md bg-muted text-sm text-muted-foreground">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
          {selected !== null && (
            <Button className="w-full mt-2" onClick={next}>
              {current < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
