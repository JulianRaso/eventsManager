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
    <div className="flex justify-between items-center mt-6">
      <Button onClick={() => navigate(navigateTo)}>Cancelar</Button>
      <Button disabled={isAdding}>{addTitle}</Button>
    </div>
  );
}
