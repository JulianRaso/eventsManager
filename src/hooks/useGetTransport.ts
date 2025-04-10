import { useQuery } from "@tanstack/react-query";
import { getTransport } from "../services/transport";

export function useGetTransport() {
  const { data, isLoading } = useQuery({
    queryKey: ["transport"],
    queryFn: getTransport,
  });

  return { data, isLoading };
}
