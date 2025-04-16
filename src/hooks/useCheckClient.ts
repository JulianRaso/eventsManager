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
      checkClient(dni)
        .then((res) => {
          if (res.dni != "") {
            setClient({
              dni: res.dni,
              name: res.name,
              lastName: res.lastName,
              phoneNumber: res.phoneNumber,
              email: res.email,
            });
            setExistClient(true);
          }
        })
        .catch(() => {
          toast.error("Error al verificar el cliente");
        });
    }
  }, [dni]);
  return { existClient, client };
}
