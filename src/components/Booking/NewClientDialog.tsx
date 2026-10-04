import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import useAddClient from "../../hooks/useAddClient";
import { isClientCodeTaken } from "../../services/client";
import type { ClientProps, NewClientProps } from "../../types";

const labelClass = "text-sm font-medium text-foreground";

type FormValues = {
  COD_CLIENTE: string;
  dni?: number | null;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (client: ClientProps) => void;
};

export default function NewClientDialog({ open, onOpenChange, onCreated }: Props) {
  const { isAdding, addClientAsync } = useAddClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { COD_CLIENTE: "", email: "", dni: null },
  });

  function handleClose(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  async function onSubmit(data: FormValues) {
    const code = data.COD_CLIENTE.trim().toUpperCase();
    const taken = await isClientCodeTaken(code);
    if (taken) {
      toast.error("El código de cliente ya existe");
      return;
    }

    const payload: NewClientProps = {
      name: data.name.trim(),
      lastName: data.lastName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email?.trim() || null,
      COD_CLIENTE: code,
      Habilitado: true,
      dni:
        data.dni == null || Number.isNaN(Number(data.dni))
          ? null
          : Number(data.dni),
    };

    try {
      const created = await addClientAsync(payload);
      onCreated(created);
      handleClose(false);
    } catch {
      // toast already handled in the hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>
            Completá los datos para crear el cliente y usarlo en la reserva.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Código <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Ej: CLI001"
                maxLength={6}
                className="uppercase"
                {...register("COD_CLIENTE", {
                  required: "El código es requerido",
                  maxLength: { value: 6, message: "Máximo 6 caracteres" },
                  pattern: {
                    value: /^[A-Za-z0-9]{1,6}$/,
                    message: "Solo letras y números (máx. 6)",
                  },
                })}
              />
              {errors.COD_CLIENTE && (
                <p className="text-xs text-destructive">{errors.COD_CLIENTE.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>DNI</label>
              <Input
                type="number"
                placeholder="Opcional"
                {...register("dni", {
                  setValueAs: (v) =>
                    v === "" || v == null || Number.isNaN(Number(v))
                      ? null
                      : Number(v),
                })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Nombre"
                {...register("name", { required: "El nombre es requerido" })}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Apellido <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Apellido"
                {...register("lastName", { required: "El apellido es requerido" })}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Teléfono <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                placeholder="Número de teléfono"
                {...register("phoneNumber", { required: "El teléfono es requerido" })}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Email</label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                {...register("email")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isAdding}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Guardando..." : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
