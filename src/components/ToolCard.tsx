import { AITool } from "@/hooks/useAITools";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles, TrendingUp, RefreshCw, FlaskConical } from "lucide-react";

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  "New Launch": {
    icon: <Sparkles className="h-3 w-3" />,
    className: "gradient-btn text-primary-foreground border-0",
  },
  Trending: {
    icon: <TrendingUp className="h-3 w-3" />,
    className: "bg-secondary text-secondary-foreground border-0",
  },
  Update: {
    icon: <RefreshCw className="h-3 w-3" />,
    className: "bg-accent text-accent-foreground border-0",
  },
  Beta: {
    icon: <FlaskConical className="h-3 w-3" />,
    className: "bg-muted text-muted-foreground border-0",
  },
};

interface ToolCardProps {
  tool: AITool;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const status = statusConfig[tool.status] || statusConfig["New Launch"];

  return (
    <div
      className="group relative rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:card-glow hover:border-primary/40"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:gradient-text transition-colors">
          {tool.name}
        </h3>
        <Badge className={`shrink-0 text-xs ${status.className}`}>
          <span className="mr-1">{status.icon}</span>
          {tool.status}
        </Badge>
      </div>

      <Badge variant="outline" className="mb-3 text-xs border-border text-muted-foreground">
        {tool.category}
      </Badge>

      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {tool.description}
      </p>

      <p className="mb-4 text-xs text-foreground/70 italic">
        💡 {tool.howToUse}
      </p>

      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
