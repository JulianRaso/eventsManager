import { CalendarDays } from "lucide-react";

function formatCurrentDate(): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date().toLocaleDateString("es-ES", options);
  // Capitalizar primera letra
  return date.charAt(0).toUpperCase() + date.slice(1);
}

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
        <CalendarDays className="h-4 w-4" />
        <span>{formatCurrentDate()}</span>
      </div>
    </div>
  );
}
