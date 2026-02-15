import { useMentor } from "@/lib/mentor-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Target, BookOpen, CheckCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function ProgressTab() {
  const { quizResults, roadmap, topicsExplored } = useMentor();

  const totalQuizzes = quizResults.length;
  const avgAccuracy = totalQuizzes > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / totalQuizzes)
    : 0;
  const roadmapProgress = roadmap.length > 0
    ? Math.round((roadmap.filter((m) => m.completed).length / roadmap.length) * 100)
    : 0;

  const chartData = quizResults.map((r, i) => ({
    name: `Q${i + 1}`,
    score: Math.round((r.score / r.total) * 100),
  }));

  const chartConfig = {
    score: { label: "Score %", color: "hsl(var(--primary))" },
  };

  const metrics = [
    { icon: Target, label: "Quizzes Taken", value: totalQuizzes },
    { icon: BarChart3, label: "Avg Accuracy", value: `${avgAccuracy}%` },
    { icon: BookOpen, label: "Topics Explored", value: topicsExplored.length },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4" />{label}
                </CardTitle>
              </CardHeader>
              <CardContent><p className="text-3xl font-bold text-foreground">{value}</p></CardContent>
            </Card>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{roadmapProgress}%</p>
              <Progress value={roadmapProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        {chartData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quiz Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px]">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Take a quiz to see your performance chart here.</p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
