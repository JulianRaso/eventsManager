import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  deletePurchase,
  getPurchaseItems,
  addPurchaseItem,
  deletePurchaseItem,
  getPurchasePayments,
  addPurchasePayment,
  deletePurchasePayment,
  PurchaseProps,
  PurchaseItemProps,
  NewPurchasePayment,
} from "../services/purchases";

export function useGetPurchases() {
  const { data, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: getAllPurchases,
  });
  return { purchases: data ?? [], isLoading };
}

export function useGetPurchaseDetail(id: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id),
    enabled: !!id,
  });
  return { purchase: data ?? null, isLoading };
}

export function useAddPurchase() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isAdding, mutate: addPurchase } = useMutation({
    mutationFn: (p: Omit<PurchaseProps, "id" | "created_at" | "supplier" | "purchase_payments">) =>
      createPurchase(p),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toast.success("Comprobante creado");
      navigate(`/compras/${data.id}`);
    },
    onError: () => toast.error("Error al crear el comprobante"),
  });
  return { isAdding, addPurchase };
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isDeleting, mutate: removePurchase } = useMutation({
    mutationFn: (id: number) => deletePurchase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      toast.success("Comprobante eliminado");
      navigate("/compras");
    },
    onError: () => toast.error("Error al eliminar el comprobante"),
  });
  return { isDeleting, removePurchase };
}

// ── Items ──────────────────────────────────────────────────────────────────

export function useGetPurchaseItems(purchaseId: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["purchaseItems", purchaseId],
    queryFn: () => getPurchaseItems(purchaseId),
    enabled: !!purchaseId,
  });
  return { items: data ?? [], isLoading };
}

export function useManagePurchaseItems(purchaseId: number) {
  const queryClient = useQueryClient();

  const { isPending: isAdding, mutate: addItem } = useMutation({
    mutationFn: (item: Omit<PurchaseItemProps, "id">) => addPurchaseItem(item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchaseItems", purchaseId] }),
    onError: () => toast.error("Error al agregar el artículo"),
  });

  const { isPending: isRemoving, mutate: removeItem } = useMutation({
    mutationFn: (id: number) => deletePurchaseItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchaseItems", purchaseId] }),
    onError: () => toast.error("Error al eliminar el artículo"),
  });

  return { isAdding, addItem, isRemoving, removeItem };
}

// ── Payments ───────────────────────────────────────────────────────────────

export function useGetPurchasePayments(purchaseId: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["purchasePayments", purchaseId],
    queryFn: () => getPurchasePayments(purchaseId),
    enabled: !!purchaseId,
  });
  return { payments: data ?? [], isLoading };
}

export function useManagePurchasePayments(purchaseId: number) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["purchasePayments", purchaseId] });
    queryClient.invalidateQueries({ queryKey: ["purchase", purchaseId] });
    queryClient.invalidateQueries({ queryKey: ["purchases"] });
  };

  const { isPending: isAddingPayment, mutate: addPayment } = useMutation({
    mutationFn: (payment: NewPurchasePayment) => addPurchasePayment(payment),
    onSuccess: invalidate,
    onError: () => toast.error("Error al registrar el pago"),
  });

  const { isPending: isRemovingPayment, mutate: removePayment } = useMutation({
    mutationFn: (id: number) => deletePurchasePayment(id, purchaseId),
    onSuccess: invalidate,
    onError: () => toast.error("Error al eliminar el pago"),
  });

  return { isAddingPayment, addPayment, isRemovingPayment, removePayment };
}
