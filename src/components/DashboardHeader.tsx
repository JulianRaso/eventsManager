import { CalendarDays } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes el resumen de tu negocio
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
        <CalendarDays className="h-4 w-4" />
        <span>{formatCurrentDate()}</span>
      </div>
    </div>
  );
}
