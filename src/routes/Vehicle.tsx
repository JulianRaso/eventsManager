import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import NavigationButtons from "../components/NavigationButtons";
import { Input } from "../components/ui/Input";
import useAddVehicle from "../hooks/useAddVehicle";
import useUpdateVehicle from "../hooks/useUpdateVehicle";
import { getCurrentTransport } from "../services/transport";
import { cn } from "../lib/utils";
import { toDDMMYYYY, fromDDMMYYYY } from "../components/formatDate";

type vehicleProps = {
  id?: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "inUse" | "maintenance";
  last_service: string;
  notes?: string;
  license_plate: string;
  updated_by: string;
};

export default function Vehicle() {
  type UserData = { email: string; user_metadata: { fullName: string } };
  const userData = useQueryClient().getQueryData(["user"]) as UserData;
  const { email, user_metadata } = userData || {
    email: "",
    user_metadata: { fullName: "" },
  };
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [lastServiceDisplay, setLastServiceDisplay] = useState("");
  const { register, reset, handleSubmit, setValue, watch } = useForm<vehicleProps>();
  const { isPending, addVehicle } = useAddVehicle();
  const { isUpdating, updateVehicle } = useUpdateVehicle();
  const vehicle = Number(useParams().vehicleId);
  const isEdittingSession = Boolean(vehicle);

  useEffect(() => {
    if (isEdittingSession) {
      getCurrentTransport(Number(vehicle))
        .then((res = []) => {
          if (res && res?.length != 0) {
            const {
              brand,
              last_service,
              license_plate,
              model,
              notes,
              status,
              type,
              updated_by,
              year,
            } = res[0];

            setValue("brand", brand);
            if (last_service) {
              setValue("last_service", last_service);
              setLastServiceDisplay(toDDMMYYYY(last_service));
            }
            setValue("model", model);
            setValue("license_plate", license_plate);
            setValue("status", status);
            if (notes) setValue("notes", notes);
            setValue("type", type);
            setValue("updated_by", updated_by);
            setValue("year", year);
          }
        })
        .catch(() => {
          toast.error("Error al actualizar el stock");
          navigate("/transporte");
        });
    }
  }, [vehicle, isEdittingSession, setValue, navigate]);

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const textareaClass =
    "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none";

  function onSubmit(data: vehicleProps) {
    // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD si es necesario
    let lastServiceISO = data.last_service;
    if (data.last_service && data.last_service.includes("/")) {
      const converted = fromDDMMYYYY(data.last_service);
      if (converted) {
        lastServiceISO = converted;
      } else {
        toast.error("Formato de fecha inválido. Use DD/MM/YYYY");
        return;
      }
    }

    const updateVehicleProps = {
      id: vehicle,
      brand: data.brand,
      last_service: lastServiceISO,
      license_plate: data.license_plate,
      model: data.model,
      notes: data.notes,
      status: data.status,
      type: data.type,
      updated_by: user_metadata.fullName != "" ? user_metadata.fullName : email,
      year: data.year,
    };
    if (isEdittingSession) updateVehicle(updateVehicleProps);
    if (!isEdittingSession) {
      addVehicle({ ...data, last_service: lastServiceISO });
    }
    reset();
    setLastServiceDisplay("");
  }

  return (
    <AddLayout>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        {isEdittingSession ? "Modificar Vehículo" : "Agregar Vehículo"}
      </h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="brand" className="text-sm font-medium text-foreground">
              Marca <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              id="brand"
              placeholder="Marca del vehículo"
              required
              {...register("brand", { required: "La marca es requerida" })}
              disabled={isEdittingSession}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="model" className="text-sm font-medium text-foreground">
              Modelo <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              required
              id="model"
              placeholder="Modelo del vehículo"
              {...register("model", { required: "El modelo es requerido" })}
              disabled={isEdittingSession}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="year" className="text-sm font-medium text-foreground">
              Año <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              required
              id="year"
              placeholder="Año del vehículo"
              min={1900}
              max={new Date().getFullYear() + 1}
              {...register("year", {
                required: "El año es requerido",
                min: { value: 1900, message: "Año inválido" },
                max: {
                  value: new Date().getFullYear() + 1,
                  message: "Año inválido",
                },
              })}
              disabled={isEdittingSession}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium text-foreground">
              Tipo <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              required
              id="type"
              placeholder="Tipo de vehículo (ej: Camioneta, Auto)"
              {...register("type", { required: "El tipo es requerido" })}
              disabled={isEdittingSession}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="license_plate" className="text-sm font-medium text-foreground">
              Patente <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              id="license_plate"
              placeholder="Patente del vehículo"
              required
              disabled={isEdittingSession}
              {...register("license_plate", {
                required: "La patente es requerida",
              })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm font-medium text-foreground">
              Estado <span className="text-destructive">*</span>
            </label>
            <select
              className={cn(selectClass)}
              {...register("status", { required: "El estado es requerido" })}
              defaultValue={status}
              onBlur={(e) => setStatus(e.target.value)}
            >
              <option value="">Seleccione un estado</option>
              <option value="available">Disponible</option>
              <option value="inUse">En uso</option>
              <option value="maintenance">En mantenimiento</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last_service" className="text-sm font-medium text-foreground">
              Último service <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              required
              id="last_service"
              placeholder="DD/MM/YYYY"
              value={lastServiceDisplay}
              onChange={(e) => {
                const value = e.target.value;
                setLastServiceDisplay(value);
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value) {
                  const isoDate = fromDDMMYYYY(value);
                  if (!isoDate) {
                    toast.error("Formato de fecha inválido. Use DD/MM/YYYY");
                    setLastServiceDisplay("");
                    setValue("last_service", "", { shouldValidate: true });
                  } else {
                    setValue("last_service", isoDate, { shouldValidate: true });
                  }
                } else {
                  setValue("last_service", "", { shouldValidate: true });
                }
              }}
            />
            <input
              type="hidden"
              {...register("last_service", {
                required: "La fecha de service es requerida",
              })}
            />
            <p className="text-xs text-muted-foreground">
              Formato: DD/MM/YYYY (ej: 25/01/2026)
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="updated_by" className="text-sm font-medium text-foreground">
              Actualizado por
            </label>
            <Input
              type="text"
              id="updated_by"
              defaultValue={
                user_metadata.fullName != "" ? user_metadata.fullName : email
              }
              {...register("updated_by")}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notas
            </label>
            <textarea
              id="notes"
              maxLength={400}
              placeholder="Notas adicionales sobre el vehículo (máx. 400 caracteres)"
              {...register("notes")}
              className={cn(textareaClass)}
            />
            <p className="text-xs text-muted-foreground">
              Máximo 400 caracteres
            </p>
          </div>
        </div>
        <NavigationButtons
          isAdding={isPending || isUpdating}
          navigateTo="/transporte"
          addTitle={isEdittingSession ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
