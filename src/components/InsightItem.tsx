import { AIInsight, InsightType } from "@/lib/ai-insights-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

interface InsightItemProps {
  insight: AIInsight;
}

const typeConfig: Record<InsightType, { icon: any; color: string; bgColor: string }> = {
  tip: { 
    icon: Lightbulb, 
    color: "text-amber-500", 
    bgColor: "bg-amber-50" 
  },
  warning: { 
    icon: AlertTriangle, 
    color: "text-rose-500", 
    bgColor: "bg-rose-50" 
  },
  success: { 
    icon: CheckCircle2, 
    color: "text-emerald-500", 
    bgColor: "bg-emerald-50" 
  },
  info: { 
    icon: Info, 
    color: "text-blue-500", 
    bgColor: "bg-blue-50" 
  },
};

export function InsightItem({ insight }: InsightItemProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/5 transition-colors group">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm leading-tight">{insight.title}</h4>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5">
            {insight.category}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {insight.description}
        </p>
        
        {insight.actionLabel && (
          <div className="pt-2">
            <Link href={insight.actionUrl || "#"}>
              <Button variant="ghost" size="sm" className="h-8 px-0 text-xs font-medium hover:bg-transparent text-primary hover:text-primary/80 flex items-center gap-1 group/btn">
                {insight.actionLabel}
                <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
