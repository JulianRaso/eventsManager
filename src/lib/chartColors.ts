/**
 * Paleta de colores para gráficos.
 * Usar hex explícitos para evitar problemas con CSS variables (oklch/hsl).
 */
export const CHART_COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  rose: "#f43f5e",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  lime: "#84cc16",
  amber: "#eab308",
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.rose,
  CHART_COLORS.cyan,
  CHART_COLORS.violet,
  CHART_COLORS.info,
  CHART_COLORS.danger,
  CHART_COLORS.lime,
  CHART_COLORS.amber,
] as const;
