import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/user";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
  return {
    isLoading,
    user,
    authenticated: user?.role === "authenticated",
  };
}
