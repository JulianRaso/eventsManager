import { useForm } from "react-hook-form";
import NavigationButtons from "../components/NavigationButtons";
import { Input } from "../components/ui/Input";
import useAddStock from "../hooks/useAddStock";
import AddLayout from "../components/AddLayout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentStock } from "../services/stock";
import useUpdateStock from "../hooks/useUpdateStock";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import { cn } from "../lib/utils";

type equipmentProps = {
  id: number;
  name: string;
  location: string;
  price: number;
  quantity: number;
  category:
    | "lights"
    | "ambientation"
    | "sound"
    | "structure"
    | "tools"
    | "cables"
    | "others"
    | "furniture"
    | "screen";
  updated_by: string;
};
type UserData = { email: string; user_metadata: { fullName: string } };

export default function Equipment() {
  const userData = useQueryClient().getQueryData(["user"]) as UserData;
  const { email, user_metadata } = userData || {
    email: "",
    user_metadata: { fullName: "" },
  };
  const [category, setCategory] = useState("");
  const { register, reset, handleSubmit, setValue } = useForm<equipmentProps>();
  const { isAdding, addStock } = useAddStock();
  const { isUpdating, updateStock } = useUpdateStock({ category: "sound" });
  const stockId = Number(useParams().stockId);
  const isEditingSession = Boolean(stockId);
  const [isLoadingEquipment, setLoadingEquipment] = useState(
    Boolean(isEditingSession)
  );

  useEffect(() => {
    if (isEditingSession) {
      getCurrentStock(stockId)
        .then((res = []) => {
          if (res && res.length !== 0) {
            const { name, location, price, quantity, category, updated_by } =
              res[0];

            setValue("name", name);
            setValue("quantity", quantity);
            setValue("location", location);
            setValue("price", price);
            setValue("category", category);
            setValue("updated_by", updated_by);
            setLoadingEquipment(false);
          }
        })
        .catch(() => {
          toast.error("Error al actualizar el stock");
        });
    }
  }, [stockId, isEditingSession, setValue]);

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  if (isLoadingEquipment) return <Spinner />;

  function onSubmit(data: equipmentProps) {
    const updatedStock = {
      id: stockId,
      name: data.name,
      quantity: data.quantity,
      location: data.location,
      price: data.price,
      category: data.category,
      updated_by: user_metadata.fullName != "" ? user_metadata.fullName : email,
    };

    if (isEditingSession) updateStock(updatedStock);
    if (!isEditingSession) addStock(data);
    reset();
  }

  return (
    <AddLayout>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        {isEditingSession ? "Modificar equipo" : "Agregar equipo"}
      </h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Nombre <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Nombre del equipo"
              {...register("name", { required: "El nombre es requerido" })}
              disabled={isEditingSession}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity" className="text-sm font-medium text-foreground">
              Cantidad <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              id="quantity"
              placeholder="Cantidad disponible"
              min={0}
              {...register("quantity", {
                required: "La cantidad es requerida",
                min: { value: 0, message: "La cantidad no puede ser negativa" },
              })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-sm font-medium text-foreground">
              Ubicación <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              id="location"
              placeholder="Ubicación del equipo"
              {...register("location", { required: "La ubicación es requerida" })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-sm font-medium text-foreground">
              Precio <span className="text-destructive">*</span>
            </label>
            <Input
              type="number"
              id="price"
              placeholder="Precio unitario"
              min={0}
              step="0.01"
              {...register("price", {
                required: "El precio es requerido",
                min: { value: 0, message: "El precio no puede ser negativo" },
              })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Categoría <span className="text-destructive">*</span>
            </label>
            <select
              className={cn(selectClass)}
              {...register("category", { required: "La categoría es requerida" })}
              defaultValue={category}
              onBlur={(e) => setCategory(e.target.value)}
            >
              <option value="">Seleccione una categoría</option>
              <option value="sound">Sonido</option>
              <option value="lights">Iluminación</option>
              <option value="ambientation">Ambientación</option>
              <option value="structure">Estructura</option>
              <option value="screen">Pantalla</option>
              <option value="furniture">Muebles</option>
              <option value="cables">Cables</option>
              <option value="tools">Herramientas</option>
              <option value="others">Otros</option>
            </select>
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
        </div>
        <NavigationButtons
          isAdding={isAdding || isUpdating}
          navigateTo="/inventario"
          addTitle={isEditingSession ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
