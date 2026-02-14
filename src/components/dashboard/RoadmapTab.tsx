import { useState } from "react";
import { useMentor } from "@/lib/mentor-context";
import { invokeFunction } from "@/lib/ai-stream";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, RefreshCw, Map } from "lucide-react";
import { toast } from "sonner";

export default function RoadmapTab() {
  const { interest, level, roadmap, setRoadmap, toggleMilestone } = useMentor();
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const data = await invokeFunction<{ roadmap: typeof roadmap }>("roadmap", { interest, level });
      setRoadmap(data.roadmap.map((m) => ({ ...m, completed: false })));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  if (roadmap.length === 0) {
    return (
      <div className="text-center py-20">
        <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Generate Your Learning Roadmap</h2>
        <p className="text-muted-foreground mb-6">Get a personalized step-by-step path for {interest} at {level} level.</p>
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Generate Roadmap
        </Button>
      </div>
    );
  }

  const completed = roadmap.filter((m) => m.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{completed}/{roadmap.length} milestones completed</p>
        <Button variant="outline" size="sm" onClick={generate} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </div>
      {roadmap.map((milestone, i) => (
        <Card key={i} className={milestone.completed ? "opacity-60" : ""}>
          <CardHeader className="pb-2 flex flex-row items-start gap-3">
            <Checkbox checked={milestone.completed} onCheckedChange={() => toggleMilestone(i)} className="mt-1" />
            <div>
              <CardTitle className="text-base">{i + 1}. {milestone.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
            </div>
          </CardHeader>
          {milestone.resources.length > 0 && (
            <CardContent className="pt-0 pl-12">
              <p className="text-xs font-medium text-muted-foreground mb-1">Resources:</p>
              <ul className="text-sm space-y-0.5">
                {milestone.resources.map((r, j) => (
                  <li key={j} className="text-muted-foreground">• {r}</li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
