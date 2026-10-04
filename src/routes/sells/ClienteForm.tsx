import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AddLayout from "../../components/AddLayout";
import NavigationButtons from "../../components/NavigationButtons";
import Spinner from "../../components/Spinner";
import { Input } from "../../components/ui/Input";
import useAddClient from "../../hooks/useAddClient";
import useUpdateClient from "../../hooks/useUpdateClient";
import { getClientById, isClientCodeTaken } from "../../services/client";
import { ClientProps, NewClientProps } from "../../types";
import { cn } from "../../lib/utils";

const labelClass = "text-sm font-medium text-foreground";

type ClientFormValues = {
  dni?: number | null;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  COD_CLIENTE: string;
  Habilitado: boolean;
};

export default function ClienteForm() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const isEditing = Boolean(clientId);
  const [isLoadingClient, setIsLoadingClient] = useState(isEditing);
  const [loadedId, setLoadedId] = useState<number | null>(
    clientId ? Number(clientId) : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormValues>({
    defaultValues: {
      Habilitado: true,
      COD_CLIENTE: "",
      dni: null,
    },
  });
  const { isAdding, addClient } = useAddClient();
  const { isUpdating, editClient } = useUpdateClient();
  const habilitado = watch("Habilitado");

  useEffect(() => {
    if (isEditing && clientId) {
      getClientById(Number(clientId))
        .then((res) => {
          if (res?.data) {
            const {
              ID_CLIENTE,
              name,
              lastName,
              phoneNumber,
              email,
              COD_CLIENTE,
              Habilitado,
              dni,
            } = res.data;
            setLoadedId(ID_CLIENTE);
            setValue("name", name);
            setValue("lastName", lastName);
            setValue("phoneNumber", phoneNumber);
            setValue("email", email ?? "");
            setValue("COD_CLIENTE", COD_CLIENTE ?? "");
            setValue("Habilitado", Habilitado ?? true);
            setValue("dni", dni ?? null);
          }
        })
        .finally(() => setIsLoadingClient(false));
    }
  }, [clientId, isEditing, setValue]);

  if (isLoadingClient) return <Spinner />;

  async function onSubmit(data: ClientFormValues) {
    const code = data.COD_CLIENTE.trim().toUpperCase();
    const taken = await isClientCodeTaken(code, loadedId ?? undefined);
    if (taken) {
      toast.error("El código de cliente ya existe");
      return;
    }

    const dniValue =
      data.dni == null || data.dni === ("" as unknown as number) || Number.isNaN(Number(data.dni))
        ? null
        : Number(data.dni);

    const base = {
      name: data.name.trim(),
      lastName: data.lastName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email?.trim() || null,
      COD_CLIENTE: code,
      Habilitado: Boolean(data.Habilitado),
      dni: dniValue,
    };

    if (isEditing && loadedId) {
      const payload: ClientProps = { ...base, ID_CLIENTE: loadedId };
      editClient(payload);
    } else {
      const payload: NewClientProps = base;
      addClient(payload, { onSuccess: () => navigate("/clientes") });
    }
  }

  return (
    <AddLayout>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        {isEditing ? "Editar cliente" : "Nuevo cliente"}
      </h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
            <label className={labelClass}>DNI</label>
            <Input
              type="number"
              placeholder="Opcional"
              {...register("dni", {
                setValueAs: (v) =>
                  v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v),
              })}
            />
          </div>

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Email</label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass}>Estado</label>
            <label
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors",
                habilitado ? "bg-emerald-50/60" : "bg-muted/40"
              )}
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {habilitado ? "Cliente habilitado" : "Cliente deshabilitado"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Los clientes deshabilitados no se pueden usar en nuevas reservas.
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                {...register("Habilitado")}
              />
            </label>
          </div>
        </div>

        <NavigationButtons
          isAdding={isAdding || isUpdating}
          navigateTo="/clientes"
          addTitle={isEditing ? "Actualizar" : "Guardar"}
        />
      </form>
    </AddLayout>
  );
}
