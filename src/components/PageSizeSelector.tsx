import { cn } from "@/lib/utils";
import type { PageSize } from "@/hooks/usePagination";

const OPTIONS: { value: PageSize; label: string }[] = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: null, label: "Todos" },
];

type Props = {
  value: PageSize;
  onChange: (value: PageSize) => void;
  className?: string;
};

export default function PageSizeSelector({ value, onChange, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-md border border-border",
        className
      )}
      role="group"
      aria-label="Registros por página"
    >
      {OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.label}
            type="button"
            title={
              option.value == null
                ? "Mostrar todos los registros"
                : `Mostrar ${option.value} registros por página`
            }
            onClick={() => onChange(option.value)}
            className={cn(
              "px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
