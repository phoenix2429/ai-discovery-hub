import { useAITools } from "@/hooks/useAITools";
import { ToolCard } from "@/components/ToolCard";
import { Bot, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { tools, loading, generatedAt, fetchTools } = useAITools();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-btn">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold gradient-text">AI Tools Tracker</h1>
              <p className="text-xs text-muted-foreground">Real-time AI tool discovery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {generatedAt && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                Updated: {generatedAt}
              </span>
            )}
            <Button
              onClick={fetchTools}
              disabled={loading}
              size="sm"
              className="gradient-btn border-0 text-primary-foreground hover:opacity-90"
            >
              {loading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-1 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading && tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-heading">Discovering latest AI tools...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No tools found. Click refresh to try again.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <ToolCard key={`${tool.name}-${i}`} tool={tool} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
