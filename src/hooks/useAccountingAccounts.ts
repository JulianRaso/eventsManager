import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAllAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  AccountingAccount,
  NewAccount,
} from "../services/accountingAccounts";

export function useGetAccounts() {
  const { data, isLoading } = useQuery({
    queryKey: ["accountingAccounts"],
    queryFn: getAllAccounts,
  });
  return { accounts: data ?? [], isLoading };
}

export function useAddAccount(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { isPending: isAdding, mutate: addAccount } = useMutation({
    mutationFn: (account: NewAccount) => createAccount(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountingAccounts"] });
      toast.success("Cuenta creada");
      onSuccess?.();
    },
    onError: () => toast.error("Error al crear la cuenta"),
  });
  return { isAdding, addAccount };
}

export function useUpdateAccount(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { isPending: isUpdating, mutate: editAccount } = useMutation({
    mutationFn: (account: AccountingAccount) => updateAccount(account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountingAccounts"] });
      toast.success("Cuenta actualizada");
      onSuccess?.();
    },
    onError: () => toast.error("Error al actualizar la cuenta"),
  });
  return { isUpdating, editAccount };
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: removeAccount } = useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountingAccounts"] });
      toast.success("Cuenta eliminada");
    },
    onError: () => toast.error("Error al eliminar la cuenta"),
  });
  return { isDeleting, removeAccount };
}
