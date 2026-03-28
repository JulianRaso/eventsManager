import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import NavigationButtons from "../components/NavigationButtons";
import Spinner from "../components/Spinner";
import { Input } from "../components/ui/Input";
import useAddClient from "../hooks/useAddClient";
import useUpdateClient from "../hooks/useUpdateClient";
import { checkClient } from "../services/client";
import { ClientProps } from "../types";
import { useState } from "react";

const labelClass = "text-sm font-medium text-foreground";

export default function ClienteForm() {
  const { dni } = useParams();
  const isEditing = Boolean(dni);
  const [isLoadingClient, setIsLoadingClient] = useState(isEditing);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientProps>();
  const { isAdding, addClient } = useAddClient();
  const { isUpdating, editClient } = useUpdateClient();

  useEffect(() => {
    if (isEditing && dni) {
      checkClient(Number(dni))
        .then((res) => {
          if (res?.data) {
            const { dni: d, name, lastName, phoneNumber, email } = res.data;
            setValue("dni", d);
            setValue("name", name);
            setValue("lastName", lastName);
            setValue("phoneNumber", phoneNumber);
            setValue("email", email ?? "");
          }
        })
        .finally(() => setIsLoadingClient(false));
    }
  }, [dni, isEditing, setValue]);

  if (isLoadingClient) return <Spinner />;

  function onSubmit(data: ClientProps) {
    const payload: ClientProps = {
      ...data,
      dni: Number(data.dni),
    };
    if (isEditing) editClient(payload);
    else addClient(payload);
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
              DNI <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              placeholder="Número de documento"
              disabled={isEditing}
              className={isEditing ? "bg-muted" : ""}
              {...register("dni", { required: "El DNI es requerido" })}
            />
            {errors.dni && (
              <p className="text-xs text-destructive">{errors.dni.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Nombre <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nombre"
              disabled={isEditing}
              className={isEditing ? "bg-muted" : ""}
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
              disabled={isEditing}
              className={isEditing ? "bg-muted" : ""}
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

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass}>Email</label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              {...register("email")}
            />
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
