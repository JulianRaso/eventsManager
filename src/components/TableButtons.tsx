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
    <div className="flex gap-1 flex-wrap">
      <Button
        variant="outline"
        className="hover:bg-gray-300"
        disabled={isDeleting}
        onClick={() => navigate(`${route}/${id}`)}
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
