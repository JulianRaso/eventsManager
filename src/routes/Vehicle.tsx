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
  const { register, reset, handleSubmit, setValue } = useForm<vehicleProps>();
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
            if (last_service) setValue("last_service", last_service);
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

  function onSubmit(data: vehicleProps) {
    const updateVehicleProps = {
      id: vehicle,
      brand: data.brand,
      last_service: data.last_service,
      license_plate: data.license_plate,
      model: data.model,
      notes: data.notes,
      status: data.status,
      type: data.type,
      updated_by: user_metadata.fullName != "" ? user_metadata.fullName : email,
      year: data.year,
    };
    if (isEdittingSession) updateVehicle(updateVehicleProps);
    if (!isEdittingSession) addVehicle(data);
    reset();
  }

  return (
    <AddLayout>
      <h1 className="text-2xl font-bold mb-4">
        {isEdittingSession ? "Modificar Vehiculo" : "Agregar Vehiculo"}
      </h1>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2">
              Marca
            </label>
            <Input
              type="text"
              id="name"
              required
              {...register("brand")}
              disabled={isEdittingSession}
            />
          </div>
          <div>
            <label htmlFor="brand" className="block mb-2">
              Modelo
            </label>
            <Input
              type="text"
              required
              id="model"
              {...register("model")}
              disabled={isEdittingSession}
            />
          </div>
          <div>
            <label htmlFor="year" className="block mb-2">
              Año
            </label>
            <Input
              type="text"
              required
              id="year"
              {...register("year")}
              disabled={isEdittingSession}
            />
          </div>
          <div>
            <label htmlFor="type" className="block mb-2">
              Tipo
            </label>
            <Input
              type="text"
              required
              id="type"
              {...register("type")}
              disabled={isEdittingSession}
            />
          </div>
          <div>
            <label className="block mb-2">Patente</label>
            <Input
              type="text"
              id="licence_plate"
              required
              disabled={isEdittingSession}
              {...register("license_plate")}
            />
          </div>
          <div>
            <label className="block mb-2">Estado</label>
            <select
              className="border rounded-md h-9 w-full"
              {...register("status")}
              defaultValue={status}
              onBlur={(e) => setStatus(e.target.value)}
              required
            >
              <option value="available">Disponible</option>
              <option value="inUse">En uso</option>
              <option value="maintenance">En mantenimiento</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Service</label>
            <Input
              type="date"
              required
              id="lastService"
              {...register("last_service")}
            />
          </div>
          <div>
            <label className="block mb-2">Actualizado por</label>
            <Input
              type="text"
              id="updated_by"
              defaultValue={
                user_metadata.fullName != "" ? user_metadata.fullName : email
              }
              {...register("updated_by")}
              disabled
            />
          </div>
          <div>
            <label className="block mb-2">Nota</label>
            <textarea
              maxLength={400}
              {...register("notes")}
              className="w-full border rounded-lg resize-none p-2"
            />
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
