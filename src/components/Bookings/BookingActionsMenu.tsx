import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

interface BookingActionsMenuProps {
  id: number;
  editRoute: string;
  viewRoute: string;
  isDeleting: boolean;
  onDelete: (id: number) => void;
}

export default function BookingActionsMenu({
  id,
  editRoute,
  viewRoute,
  isDeleting,
  onDelete,
}: BookingActionsMenuProps) {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  function handleDelete() {
    setOpenMenu(false);
    setOpenConfirm(true);
  }

  function handleConfirmDelete() {
    onDelete(id);
    setOpenConfirm(false);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Popover open={openMenu} onOpenChange={setOpenMenu}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDeleting}
            aria-label="Más opciones"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-40 p-1"
        >
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              setOpenMenu(false);
              navigate(`${viewRoute}/${id}`);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            Ver
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              setOpenMenu(false);
              navigate(`${editRoute}/${id}`);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </PopoverContent>
      </Popover>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar esta reserva?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Está seguro que desea eliminar esta reserva?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => setOpenConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
