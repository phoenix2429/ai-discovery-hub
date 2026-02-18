import { useState, useCallback } from "react";
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

      setTools(data.tools || []);
      setGeneratedAt(data.generatedAt || null);
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
  }, []);

  return { tools, loading, generatedAt, fetchTools };
}
