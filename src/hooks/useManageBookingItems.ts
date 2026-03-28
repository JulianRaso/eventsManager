import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addItems, deleteItem } from "../services/bookingItems";

interface NewItem {
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function useManageBookingItems(bookingId: number) {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["bookingItems", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["upcomingBookingItems"] });
  }

  const { mutate: addItem, isPending: isAdding } = useMutation({
    mutationFn: (item: NewItem) =>
      addItems([{ ...item, booking_id: bookingId }]),
    onSuccess: () => {
      toast.success("Equipo agregado");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      toast.success("Equipo quitado");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { addItem, isAdding, removeItem, isRemoving };
}
