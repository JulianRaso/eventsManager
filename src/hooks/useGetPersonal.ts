import { useQuery } from "@tanstack/react-query";
import { getPersonal } from "../services/personal";

export default function useGetPersonal() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["personal"],
    queryFn: getPersonal,
  });
  return { data, isLoading };
}
