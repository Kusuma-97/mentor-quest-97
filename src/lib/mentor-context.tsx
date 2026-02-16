import React, { createContext, useContext, useState, useCallback } from "react";

export type Interest = "Web Development" | "Data Science" | "Machine Learning" | "UI/UX Design" | "Mobile Development" | "Cybersecurity";
export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface QuizResult {
  topic: string;
  score: number;
  total: number;
  timestamp: number;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  resources: string[];
  completed: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface MentorContextType {
  interest: Interest | null;
  level: Level | null;
  setInterest: (i: Interest) => void;
  setLevel: (l: Level) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatsByDomain: Record<string, ChatMessage[]>;
  quizResults: QuizResult[];
  addQuizResult: (r: QuizResult) => void;
  roadmap: RoadmapMilestone[];
  setRoadmap: (r: RoadmapMilestone[]) => void;
  toggleMilestone: (index: number) => void;
  topicsExplored: string[];
  addTopic: (t: string) => void;
}

const MentorContext = createContext<MentorContextType | null>(null);

export function MentorProvider({ children }: { children: React.ReactNode }) {
  const [interest, setInterest] = useState<Interest | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [chatsByDomain, setChatsByDomain] = useState<Record<string, ChatMessage[]>>({});
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>([]);
  const [topicsExplored, setTopicsExplored] = useState<string[]>([]);
  const domainKey = interest ?? "";
  const chatMessages = chatsByDomain[domainKey] ?? [];
  const setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>> = useCallback(
    (action) => {
      setChatsByDomain((prev) => {
        const current = prev[domainKey] ?? [];
        const next = typeof action === "function" ? action(current) : action;
        return { ...prev, [domainKey]: next };
      });
    },
    [domainKey]
  );

  const addQuizResult = useCallback((r: QuizResult) => {
    setQuizResults((prev) => [...prev, r]);
  }, []);

  const toggleMilestone = useCallback((index: number) => {
    setRoadmap((prev) =>
      prev.map((m, i) => (i === index ? { ...m, completed: !m.completed } : m))
    );
  }, []);

  const addTopic = useCallback((t: string) => {
    setTopicsExplored((prev) => (prev.includes(t) ? prev : [...prev, t]));
  }, []);

  return (
    <MentorContext.Provider
      value={{
        interest, level, setInterest, setLevel,
        chatMessages, setChatMessages, chatsByDomain,
        quizResults, addQuizResult,
        roadmap, setRoadmap, toggleMilestone,
        topicsExplored, addTopic,
      }}
    >
      {children}
    </MentorContext.Provider>
  );
}

export function useMentor() {
  const ctx = useContext(MentorContext);
  if (!ctx) throw new Error("useMentor must be used within MentorProvider");
  return ctx;
}
