import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import NavigationButtons from "../components/NavigationButtons";
import Spinner from "../components/Spinner";
import { Input } from "../components/ui/Input";
import useAddPersonal from "../hooks/useAddPersonal";
import useUpdatePersonal from "../hooks/useUpdatePersonal";
import { getPersonalById } from "../services/personal";
import { PersonalRole } from "../types";
import { PersonalProps, PersonaledProps } from "../types";
import { cn } from "../lib/utils";

const roles = [
  { value: "tecnico", label: "Técnico" },
  { value: "sonidista", label: "Sonidista" },
  { value: "iluminador", label: "Iluminador" },
  { value: "chofer", label: "Chofer" },
  { value: "coordinador", label: "Coordinador" },
  { value: "otro", label: "Otro" },
];

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const labelClass = "text-sm font-medium text-foreground";

export default function PersonalForm() {
  const { personalId } = useParams();
  const isEditing = Boolean(personalId);

  const { isAdding, createPersonal } = useAddPersonal();
  const { isUpdating, editPersonal } = useUpdatePersonal();
  const isSaving = isAdding || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalProps & { id?: number }>();

  useEffect(() => {
    if (!isEditing) return;
    getPersonalById(Number(personalId)).then((data) => {
      if (!data) return;
      setValue("name", data.name);
      setValue("lastName", data.lastName);
      if (data.dni) setValue("dni", data.dni);
      if (data.phoneNumber) setValue("phoneNumber", data.phoneNumber);
      setValue("role", data.role as PersonalRole);
      setValue("daily_rate", data.daily_rate);
      if (data.notes) setValue("notes", data.notes);
    });
  }, [isEditing, personalId, setValue]);

  function onSubmit(data: PersonalProps) {
    if (isEditing) {
      editPersonal({ ...data, id: Number(personalId) } as PersonaledProps);
    } else {
      createPersonal(data);
    }
  }

  if (isEditing && isSaving) return <Spinner />;

  return (
    <AddLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {isEditing ? "Editar empleado" : "Nuevo empleado"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEditing
            ? "Modificá los datos del empleado"
            : "Completá los datos para agregar un empleado al equipo"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className={labelClass}>
              Nombre <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="Juan"
              {...register("name", { required: "El nombre es requerido" })}
              disabled={isSaving}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Apellido */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className={labelClass}>
              Apellido <span className="text-destructive">*</span>
            </label>
            <Input
              id="lastName"
              placeholder="Pérez"
              {...register("lastName", { required: "El apellido es requerido" })}
              disabled={isSaving}
              className={cn(errors.lastName && "border-destructive")}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className={labelClass}>
              Rol <span className="text-destructive">*</span>
            </label>
            <select
              id="role"
              className={cn(selectClass, errors.role && "border-destructive")}
              {...register("role", { required: "El rol es requerido" })}
              disabled={isSaving}
            >
              <option value="">Seleccionar rol...</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Tarifa diaria */}
          <div className="flex flex-col gap-2">
            <label htmlFor="daily_rate" className={labelClass}>
              Tarifa por día ($) <span className="text-destructive">*</span>
            </label>
            <Input
              id="daily_rate"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              {...register("daily_rate", {
                required: "La tarifa es requerida",
                min: { value: 0, message: "Debe ser mayor a 0" },
                valueAsNumber: true,
              })}
              disabled={isSaving}
              className={cn(errors.daily_rate && "border-destructive")}
            />
            {errors.daily_rate && (
              <p className="text-xs text-destructive">
                {errors.daily_rate.message}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phoneNumber" className={labelClass}>
              Teléfono
            </label>
            <Input
              id="phoneNumber"
              placeholder="+54 9 379 ..."
              {...register("phoneNumber")}
              disabled={isSaving}
            />
          </div>

          {/* DNI */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dni" className={labelClass}>
              DNI
            </label>
            <Input
              id="dni"
              type="number"
              placeholder="12345678"
              {...register("dni", { valueAsNumber: true })}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className={labelClass}>
            Notas
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Observaciones, horarios disponibles, etc."
            className={cn(
              selectClass,
              "h-auto resize-none py-2 leading-relaxed"
            )}
            {...register("notes")}
            disabled={isSaving}
          />
        </div>

        <NavigationButtons
          isAdding={isSaving}
          navigateTo="/personal"
          addTitle={isEditing ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
