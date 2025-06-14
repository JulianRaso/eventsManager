import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkClient } from "../services/client";

export default function useCheckClient(dni: string) {
  const [existClient, setExistClient] = useState(false);
  const [client, setClient] = useState({
    dni: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    if (dni != "") {
      checkClient(Number(dni))
        .then((res) => {
          if (res.data) {
            setClient({
              dni: res.data.dni.toString(),
              name: res.data.name,
              lastName: res.data.lastName,
              phoneNumber: res.data.phoneNumber,
              email: res.data.email || "",
            });
            setExistClient(true);
          }
          if (!res.data) {
            setExistClient(false);
            setClient({
              dni: "",
              name: "",
              lastName: "",
              phoneNumber: "",
              email: "",
            });
          }
        })
        .catch(() => {
          toast.error("Error al verificar el cliente");
        });
    }
  }, [dni]);
  return { existClient, client };
}
