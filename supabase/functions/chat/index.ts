import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, interest, level, temperature = 0.7, max_tokens = 1024 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const creativityLabel = temperature <= 0.3 ? "precise and factual" : temperature <= 0.6 ? "balanced" : temperature <= 0.8 ? "creative and exploratory" : "highly creative and imaginative";
    const lengthLabel = max_tokens <= 512 ? "Keep responses brief and concise (1-2 paragraphs)." : max_tokens <= 1024 ? "Provide moderately detailed responses." : max_tokens <= 2048 ? "Give thorough, detailed explanations with examples." : "Provide comprehensive, in-depth responses with multiple examples, analogies, and detailed breakdowns.";

    const systemPrompt = `You are an expert AI mentor specializing in ${interest} for ${level}-level learners.

Response Style: Be ${creativityLabel} in your approach.
${lengthLabel}

Guidelines:
- Provide accurate, well-researched answers specific to ${interest}.
- Adapt complexity to ${level} level — use simpler language for beginners, technical depth for advanced.
- Use concrete examples, real-world analogies, and practical tips relevant to ${interest}.
- Format with markdown: headers, bullet points, code blocks, and bold text for key concepts.
- When creativity is high, explore unconventional approaches and connections. When low, stick strictly to established facts.
- Always be encouraging and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
