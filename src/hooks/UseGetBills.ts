import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../services/bill";

export default function useGetBills() {
  const { data, isLoading } = useQuery({
    queryKey: ["bills"],
    queryFn: () => getInvoices(),
  });

  return { data, isLoading };
}
