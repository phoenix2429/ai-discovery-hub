import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an AI tools researcher. Return ONLY a valid JSON array of the latest AI tools that have been discovered, launched, or are trending as of ${today}. Each object must have: "name" (string), "category" (string like "LLM", "Image Gen", "Code Assistant", "Productivity", "Video", "Audio", "Search", "Agent"), "description" (1-2 sentences about what it does), "howToUse" (1 sentence on how to get started), "status" (one of "New Launch", "Trending", "Update", "Beta"), "url" (official website URL if known, otherwise empty string). Return 8-12 tools. Only return the JSON array, no markdown formatting, no code blocks.`,
            },
            {
              role: "user",
              content: `What are the newest and most noteworthy AI tools as of ${today}? Include recently launched tools, major updates to existing tools, and trending AI tools. Focus on tools that developers, creators, and professionals would find useful.`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the JSON from the AI response
    let tools;
    try {
      // Try to extract JSON array from potential markdown wrapping
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      tools = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse AI response:", content);
      tools = [];
    }

    return new Response(JSON.stringify({ tools, generatedAt: today }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
