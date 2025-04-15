import { useForm } from "react-hook-form";
import AddLayout from "../components/addLayout";
import NavigationButtons from "../components/NavigationButtons";
import { Input } from "../components/ui/Input";
import useAddStock from "../hooks/useAddStock";

export default function Equipment() {
  const { register, reset, handleSubmit } = useForm();
  const { isAdding, addStock } = useAddStock();

  function onSubmit(data) {
    addStock(data);
    reset();
  }

  return (
    <AddLayout>
      <h1 className="text-2xl font-bold mb-4">Agregar equipo</h1>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2">
              Nombre
            </label>
            <Input type="text" id="name" {...register("name")} />
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
              defaultValue={"sound"}
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
              defaultValue={"Sistema"}
              {...register("updated_by")}
              disabled
            />
          </div>
        </div>
        <NavigationButtons
          isAdding={isAdding}
          navigateTo="/inventario"
          addTitle="Agregar"
        />
      </form>
    </AddLayout>
  );
}
