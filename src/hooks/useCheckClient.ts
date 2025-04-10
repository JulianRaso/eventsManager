import { useQuery } from "@tanstack/react-query";
import { checkClient } from "../services/client";

export default function useCheckClient(dni: string) {
  const {
    data: client,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["client"],
    queryFn: () => checkClient(dni),
    enabled: false,
    initialData: {
      dni: "",
      name: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });

  return { client, isLoading, refetch, isRefetching };
}
