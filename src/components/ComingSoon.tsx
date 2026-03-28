import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <Construction className="h-10 w-10 text-muted-foreground" />
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {description ?? "Este módulo está en desarrollo."}
      </p>
    </div>
  );
}
