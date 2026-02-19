import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Save, Loader2, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileData {
  display_name: string;
  bio: string;
  academic_level: string;
  avatar_url: string;
}

const academicLevels = [
  "Elementary School", "Middle School", "High School",
  "Undergraduate", "Graduate", "Postgraduate", "Professional",
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };
  const [profile, setProfile] = useState<ProfileData>({
    display_name: "", bio: "", academic_level: "", avatar_url: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, academic_level, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setProfile({
          display_name: data.display_name ?? "",
          bio: data.bio ?? "",
          academic_level: data.academic_level ?? "",
          avatar_url: data.avatar_url ?? "",
        });
      }
      if (error) console.error(error);
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name || null,
        bio: profile.bio || null,
        academic_level: profile.academic_level || null,
        avatar_url: profile.avatar_url || null,
      })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Your profile has been updated." });
    }
  };

  const initials = profile.display_name
    ? profile.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-64 gradient-primary opacity-5 blur-2xl pointer-events-none" />

        {/* Header */}
        <motion.header
          className="border-b bg-card/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="text-xl font-bold gradient-text">My Profile</h1>
          <div className="ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button onClick={toggleTheme} className="text-muted-foreground hover:text-primary transition-colors" whileHover={{ scale: 1.15, rotate: 20 }} whileTap={{ scale: 0.9 }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={dark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>{dark ? "Light mode" : "Dark mode"}</TooltipContent>
            </Tooltip>
          </div>
        </motion.header>

        <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="overflow-hidden glass border-border/50 glow-sm">
              {/* Avatar section */}
              <motion.div
                className="gradient-primary p-8 flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-2xl font-bold bg-background text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <p className="text-sm text-primary-foreground/80">{user?.email}</p>
              </motion.div>

              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Display Name", id: "display_name", type: "input" as const, placeholder: "Your name", delay: 0.15 },
                  { label: "Bio", id: "bio", type: "textarea" as const, placeholder: "Tell us about yourself...", delay: 0.2 },
                  { label: "Academic Level", id: "academic_level", type: "select" as const, delay: 0.25 },
                  { label: "Avatar URL", id: "avatar_url", type: "input" as const, placeholder: "https://example.com/avatar.png", delay: 0.3 },
                ].map((field) => (
                  <motion.div
                    key={field.id}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: field.delay }}
                  >
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        value={profile[field.id as keyof ProfileData]}
                        onChange={(e) => setProfile((p) => ({ ...p, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={3}
                      />
                    ) : field.type === "select" ? (
                      <Select
                        value={profile.academic_level}
                        onValueChange={(v) => setProfile((p) => ({ ...p, academic_level: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicLevels.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.id}
                        value={profile[field.id as keyof ProfileData]}
                        onChange={(e) => setProfile((p) => ({ ...p, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                      />
                    )}
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <Button onClick={handleSave} disabled={saving} className="w-full gap-2 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
