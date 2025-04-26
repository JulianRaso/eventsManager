import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { IoMdAdd } from "react-icons/io";

export default function AddButton({ navigateTo }: { navigateTo: string }) {
  return (
    <NavLink to={navigateTo}>
      <Button variant="outline">
        <IoMdAdd />
      </Button>
    </NavLink>
  );
}
