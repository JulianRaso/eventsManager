import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

export default function AddButton({ navigateTo }: { navigateTo: string }) {
  return (
    <NavLink to={navigateTo}>
      <Button variant="default" size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        Nueva reserva
      </Button>
    </NavLink>
  );
}
