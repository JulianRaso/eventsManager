import { useState } from "react";
import { Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface TableButtonsProps {
  id: number;
  route: string;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  /** Texto opcional para el mensaje, ej: "esta reserva", "este gasto", "este elemento" */
  deleteLabel?: string;
  /** Ruta base del recibo. Si se omite, el botón "Recibo" no se muestra. */
  receiptRoute?: string;
  /** Ruta base de la vista detalle. Si se omite, el botón "Ver" no se muestra. */
  viewRoute?: string;
}

export default function TableButtons({
  id,
  route,
  isDeleting,
  onDelete,
  deleteLabel = "este elemento",
  receiptRoute,
  viewRoute,
}: TableButtonsProps) {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);

  function handleConfirmDelete() {
    onDelete(id);
    setOpenConfirm(false);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {viewRoute && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          disabled={isDeleting}
          onClick={() => navigate(`${viewRoute}/${id}`)}
        >
          <Eye className="mr-1 h-3.5 w-3.5" />
          Ver
        </Button>
      )}
      {receiptRoute && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          disabled={isDeleting}
          onClick={() => navigate(`${receiptRoute}/${id}`)}
        >
          <FileText className="mr-1 h-3.5 w-3.5" />
          Recibo
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={isDeleting}
        onClick={() => navigate(`${route}/${id}`)}
      >
        <Pencil className="mr-1 h-3.5 w-3.5" />
        Editar
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        disabled={isDeleting}
        onClick={() => setOpenConfirm(true)}
      >
        <Trash2 className="mr-1 h-3.5 w-3.5" />
        Eliminar
      </Button>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar {deleteLabel}?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Está seguro que desea eliminar {deleteLabel}?
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
