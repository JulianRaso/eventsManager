import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { Button } from "../components/ui/button";

interface FilterProps {
  filterByName: string;
  navigateTo: string;
  setFilterByName: (value: string) => void;
}

export default function FilterStock({
  filterByName,
  setFilterByName,
  navigateTo,
}: FilterProps) {
  return (
    <div className="w-full flex justify-between m-4">
      <NavLink to={navigateTo}>
        <Button variant="outline">
          <IoMdAdd />
        </Button>
      </NavLink>
      <div className="flex gap-1 items-center">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={filterByName}
          className="border rounded-lg p-1.5 bg-gray-50"
          onChange={(event) => setFilterByName(event.currentTarget.value)}
        />
        <Button variant="outline" onClick={() => setFilterByName("")}>
          X
        </Button>
      </div>
    </div>
  );
}
