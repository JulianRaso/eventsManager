import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

interface AddButtonProps {
  navigateTo: string;
  label?: string;
}

export default function AddButton({ navigateTo, label = "Agregar" }: AddButtonProps) {
  return (
    <NavLink to={navigateTo}>
      <Button variant="default" size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" />
        {label}
      </Button>
    </NavLink>
  );
}
