import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";

interface FilterProps {
  filterByStatus: Array<{ value: string; label: string }>;
  value: string;
  filterByName: string;
  navigateTo: string;
  setValue: (value: string) => void;
  setFilterByName: (value: string) => void;
}

export default function Filter({
  filterByStatus,
  value,
  setValue,
  filterByName,
  setFilterByName,
  navigateTo,
}: FilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between">
      <NavLink to={navigateTo}>
        <Button variant="outline">
          <IoMdAdd />
        </Button>
      </NavLink>
      <div className="flex gap-1 items-center">
        <input
          type="text"
          placeholder="Buscar por Nombre"
          value={filterByName}
          className="border rounded-lg p-1.5 bg-gray-50"
          onChange={(event) => setFilterByName(event.currentTarget.value)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? filterByStatus.find((status) => status.value === value)?.label
                : "Seleccionar filtro..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] h-[190px] p-0">
            <Command>
              <CommandInput placeholder="Buscar filtro" className="h-9" />
              <CommandList>
                <CommandEmpty>No fue encontrado.</CommandEmpty>
                <CommandGroup>
                  {filterByStatus.map((status) => (
                    <CommandItem
                      key={status.value}
                      value={status.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {status.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === status.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          onClick={() => (setValue(""), setFilterByName(""))}
        >
          X
        </Button>
      </div>
    </div>
  );
}
