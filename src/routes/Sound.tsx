import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { getStock } from "../services/data";

export default function Sound() {
  const {
    data = [{ name: "", quantity: 0, location: "", price: 0 }],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["soundEquipment"],
    queryFn: () => getStock({ category: "sound" }),
  });

  if (error) return <div>Fail to read</div>;
  if (isLoading) return <Spinner />;

  return (
    <div className="w-full h-full flex flex-col items-center p-2">
      <p className="">Equipo de Sonido</p>
      <div className="w-10/12 border-collapse">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nombre</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Ubicacion</TableHead>
              <TableHead className="text-right">Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((equipment) => (
              <TableRow key={equipment.invoice}>
                <TableCell className="font-medium">{equipment.name}</TableCell>
                <TableCell>{equipment.quantity}</TableCell>
                <TableCell>{equipment.location}</TableCell>
                <TableCell className="text-right">{equipment.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
