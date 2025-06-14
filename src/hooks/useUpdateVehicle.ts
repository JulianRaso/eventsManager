import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransport as updateTransportAPI } from "../services/transport";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface vehicleProps {
  id?: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "inUse" | "maintenance";
  last_service: string;
  notes?: string;
  license_plate: string;
  updated_by: string;
}

export default function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isUpdating, mutate: updateVehicle } = useMutation({
    mutationKey: ["vehicle"],
    mutationFn: (vehicle: vehicleProps) => updateTransportAPI(vehicle),
    onSuccess: () => {
      toast.success("Vehiculo actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["vehicle"],
      });
      navigate("/transporte");
    },
  });

  return { isUpdating, updateVehicle };
}
