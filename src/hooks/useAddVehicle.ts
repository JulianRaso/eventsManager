import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addVehicle as addVehicleAPI } from "../services/transport";

interface vehicleProps {
  brand: string;
  model: string;
  year: number;
  type: string;
  status: string;
  last_service: string;
  notes?: string;
  license_plate: string;
  updated_by: string;
}

export default function useAddVehicle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, mutate: addVehicle } = useMutation({
    mutationKey: ["transport"],
    mutationFn: (vehicle: vehicleProps) => addVehicleAPI(vehicle),
    onSuccess: () => {
      toast.success("Se actualizo correctamente el vehiculo");
      queryClient.invalidateQueries({
        queryKey: ["transport"],
      });
      navigate("/transporte");
    },
  });

  return { addVehicle, isPending };
}
