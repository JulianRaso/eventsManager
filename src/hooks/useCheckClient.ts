import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getClientById } from "../services/client";

export default function useCheckClient(clientId: string) {
  const [existClient, setExistClient] = useState(false);
  const [client, setClient] = useState({
    ID_CLIENTE: "",
    dni: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    COD_CLIENTE: "",
  });

  useEffect(() => {
    if (clientId != "") {
      getClientById(Number(clientId))
        .then((res) => {
          if (res.data?.Habilitado) {
            setClient({
              ID_CLIENTE: res.data.ID_CLIENTE.toString(),
              dni: res.data.dni != null ? res.data.dni.toString() : "",
              name: res.data.name,
              lastName: res.data.lastName,
              phoneNumber: res.data.phoneNumber,
              email: res.data.email || "",
              COD_CLIENTE: res.data.COD_CLIENTE || "",
            });
            setExistClient(true);
          } else {
            if (res.data && !res.data.Habilitado) {
              toast.error("El cliente está deshabilitado");
            }
            setExistClient(false);
            setClient({
              ID_CLIENTE: "",
              dni: "",
              name: "",
              lastName: "",
              phoneNumber: "",
              email: "",
              COD_CLIENTE: "",
            });
          }
        })
        .catch(() => {
          toast.error("Error al verificar el cliente");
        });
    }
  }, [clientId]);
  return { existClient, client };
}
