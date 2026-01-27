import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface TableButtonsProps {
  id: number;
  route: string;
  isDeleting: boolean;
  onDelete: (id: number) => void;
}
export default function TableButtons({
  id,
  route,
  isDeleting,
  onDelete,
}: TableButtonsProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={isDeleting}
        onClick={() => navigate(`${route}/${id}`)}
      >
        <Pencil className="mr-1 h-3.5 w-3.5" />
        Editar
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        disabled={isDeleting}
        onClick={() => onDelete(id)}
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" />
        Eliminar
      </Button>
    </div>
  );
}
