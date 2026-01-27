import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

type GradientVariant = "primary" | "success" | "warning" | "info";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: GradientVariant;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const gradientStyles: Record<GradientVariant, string> = {
  primary: "from-indigo-500 to-purple-600",
  success: "from-emerald-500 to-teal-600",
  warning: "from-amber-500 to-orange-600",
  info: "from-blue-500 to-cyan-600",
};

const iconBgStyles: Record<GradientVariant, string> = {
  primary: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  info: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
};

export function KPICard({
  title,
  value,
  icon: Icon,
  variant = "primary",
  trend,
  description,
}: KPICardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-6",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "hover:-translate-y-1"
      )}
    >
      {/* Gradient accent bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
          gradientStyles[variant]
        )}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs mes anterior</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            iconBgStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default KPICard;
