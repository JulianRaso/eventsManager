import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  SupplierProps,
} from "../services/suppliers";

export function useGetSuppliers() {
  const { data, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliers,
  });
  return { suppliers: data ?? [], isLoading };
}

export function useAddSupplier() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isAdding, mutate: addSupplier } = useMutation({
    mutationFn: (s: Omit<SupplierProps, "id" | "created_at">) => createSupplier(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Proveedor creado");
      navigate("/proveedores");
    },
    onError: () => toast.error("Error al crear el proveedor"),
  });
  return { isAdding, addSupplier };
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isUpdating, mutate: editSupplier } = useMutation({
    mutationFn: (s: SupplierProps) => updateSupplier(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Proveedor actualizado");
      navigate("/proveedores");
    },
    onError: () => toast.error("Error al actualizar el proveedor"),
  });
  return { isUpdating, editSupplier };
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: removeSupplier } = useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Proveedor eliminado");
    },
    onError: () => toast.error("Error al eliminar el proveedor"),
  });
  return { isDeleting, removeSupplier };
}
