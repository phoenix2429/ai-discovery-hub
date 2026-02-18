import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AITool {
  name: string;
  category: string;
  description: string;
  howToUse: string;
  status: string;
  url: string;
}

export function useAITools() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  // Load stored tools from the database
  const loadStoredTools = useCallback(async () => {
    const { data, error } = await supabase
      .from("ai_tools")
      .select("*")
      .order("generated_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to load stored tools:", error);
      return false;
    }

    if (data && data.length > 0) {
      setTools(
        data.map((row: any) => ({
          name: row.name,
          category: row.category,
          description: row.description,
          howToUse: row.how_to_use,
          status: row.status,
          url: row.url,
        }))
      );
      setGeneratedAt(data[0].generated_at);
      return true;
    }
    return false;
  }, []);

  // Fetch fresh tools from AI via edge function
  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tools-tracker");

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      // Reload from DB after the edge function persists
      await loadStoredTools();
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch AI tools",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loadStoredTools]);

  // On mount, load stored tools. If none exist, fetch fresh ones.
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const hasStored = await loadStoredTools();
      if (!hasStored) {
        await fetchTools();
      }
      setLoading(false);
    };
    init();
  }, [loadStoredTools, fetchTools]);

  return { tools, loading, generatedAt, fetchTools };
}
