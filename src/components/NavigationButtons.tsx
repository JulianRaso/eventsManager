import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function NavigationButtons({
  navigateTo,
  isAdding,
  addTitle,
}: {
  navigateTo: string;
  isAdding: boolean;
  addTitle: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={(e) => (e.preventDefault(), navigate(navigateTo))}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isAdding}>
        {addTitle}
      </Button>
    </div>
  );
}
