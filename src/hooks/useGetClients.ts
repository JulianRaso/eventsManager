import { useQuery } from "@tanstack/react-query";
import { getAllClients } from "../services/client";

export default function useGetClients() {
  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });
  return { data: data ?? [], isLoading };
}
