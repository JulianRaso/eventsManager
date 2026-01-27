import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Input } from "./ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";

interface FilterProps {
  filterByStatus: Array<{ value: string; label: string }>;
  value: string;
  className?: string;
  filterByName: string;
  setValue: (value: string) => void;
  setFilterByName: (value: string) => void;
}

export default function Filter({
  filterByStatus,
  value,
  setValue,
  filterByName,
  setFilterByName,
  className,
}: FilterProps) {
  const [open, setOpen] = useState(false);
  const hasFilters = Boolean(filterByName || value);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="relative flex-1 min-w-[160px] max-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={filterByName}
          onChange={(e) => setFilterByName(e.target.value)}
          className="pl-9"
        />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? filterByStatus.find((s) => s.value === value)?.label
              : "Filtrar por estado..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar filtro..." className="h-9" />
            <CommandList>
              <CommandEmpty>No encontrado.</CommandEmpty>
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
                        "ml-auto h-4 w-4",
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
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setValue("");
            setFilterByName("");
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
