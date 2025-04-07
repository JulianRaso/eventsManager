import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface ActionProps {
  id: number;
  isDeleting: boolean;
  onDelete: (id: number) => void;
}
export default function Action({ id, isDeleting, onDelete }: ActionProps) {
  const navigate = useNavigate();
  return (
    <div className="flex gap-1 flex-wrap">
      <Button
        variant="outline"
        className="hover:bg-gray-300"
        disabled={isDeleting}
        onClick={() => navigate(`/reservas/reserva/${id}`)}
      >
        Editar
      </Button>
      <Button
        variant="outline"
        className="hover:bg-red-500"
        onClick={() => onDelete(id)}
      >
        Eliminar
      </Button>
    </div>
  );
}
