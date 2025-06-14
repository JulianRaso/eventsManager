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

export default function Equipment() {
  type UserData = { email: string; user_metadata: { fullName: string } };
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
  const isEdittingSession = Boolean(stockId);
  const [isLoadingEquipment, setLoadingEquipment] = useState(
    Boolean(isEdittingSession)
  );

  useEffect(() => {
    if (isEdittingSession) {
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
  }, [stockId, isEdittingSession, setValue]);

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

    if (isEdittingSession) updateStock(updatedStock);
    if (!isEdittingSession) addStock(data);
    reset();
  }

  return (
    <AddLayout>
      <h1 className="text-2xl font-bold mb-4">
        {isEdittingSession ? "Modificar equipo" : "Agregar equipo"}
      </h1>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2">
              Nombre
            </label>
            <Input
              type="text"
              id="name"
              {...register("name")}
              disabled={isEdittingSession}
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2">
              Cantidad
            </label>
            <Input type="number" id="quantity" {...register("quantity")} />
          </div>
          <div>
            <label htmlFor="location" className="block mb-2">
              Ubicacion
            </label>
            <Input type="text" id="location" {...register("location")} />
          </div>
          <div>
            <label htmlFor="price" className="block mb-2">
              Precio
            </label>
            <Input type="number" id="price" {...register("price")} />
          </div>
          <div>
            <label className="block mb-2">Categoria</label>
            <select
              className="border rounded-md h-9 w-full"
              {...register("category")}
              defaultValue={category}
              onBlur={(e) => setCategory(e.target.value)}
              required
            >
              <option value="sound">Sonido</option>
              <option value="lights">Iluminacion</option>
              <option value="ambientation">Ambientacion</option>
              <option value="structure">Estructura</option>
              <option value="screen">Pantalla</option>
              <option value="furniture">Muebles</option>
              <option value="cables">Cables</option>
              <option value="tools">Herramientas</option>
              <option value="others">Otro</option>
            </select>
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
        </div>
        <NavigationButtons
          isAdding={isAdding || isUpdating}
          navigateTo="/inventario"
          addTitle={isEdittingSession ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
