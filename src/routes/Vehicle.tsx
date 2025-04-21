import { useForm } from "react-hook-form";
import AddLayout from "../components/AddLayout";
import { useParams } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import useAddVehicle from "../hooks/useAddVehicle";

export default function Vehicle() {
  const [status, setStatus] = useState("");
  const { register, reset, handleSubmit, setValue } = useForm();
  const { isPending, addVehicle } = useAddVehicle();
  const vehicle = useParams().vehicleId;
  const isEdittingSession = Boolean(vehicle);

  function onSubmit(data) {
    // if (isEdittingSession) updateStock(updatedStock);
    if (!isEdittingSession) addVehicle(data);
    reset();
  }

  return (
    <AddLayout>
      <h1 className="text-2xl font-bold mb-4">Agregar vehiculo</h1>
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
            <label htmlFor="quantity" className="block mb-2">
              Modelo
            </label>
            <Input type="text" required id="model" {...register("model")} />
          </div>
          <div>
            <label htmlFor="year" className="block mb-2">
              Año
            </label>
            <Input type="text" required id="year" {...register("year")} />
          </div>
          <div>
            <label htmlFor="type" className="block mb-2">
              Tipo
            </label>
            <Input type="text" required id="type" {...register("type")} />
          </div>
          <div>
            <label className="block mb-2">Patente</label>
            <Input
              type="text"
              id="licence_plate"
              required
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
              defaultValue={"Sistema"}
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
          isAdding={isPending}
          navigateTo="/transporte"
          addTitle={isEdittingSession ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
