import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import { getStock } from "../services/data";

export default function Decoration() {
  const { data, isLoading } = useQuery({
    queryKey: ["decoration"],
    queryFn: () => getStock({ category: "decoration" }),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="p-8">
      <div className="text-xl font-semibold mb-4">Ambientacion</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
                Cantidad
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
                Ubicación
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
                Precio
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-md text-gray-800">
                  {item.name}
                </td>
                <td className="px-4 py-2 border-b text-md text-gray-800">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 border-b text-md text-gray-800">
                  {item.location}
                </td>
                <td className="px-4 py-2 border-b text-md text-gray-800">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
