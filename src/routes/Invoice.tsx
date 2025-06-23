import AddLayout from "@/components/AddLayout";
import NavigationButtons from "@/components/NavigationButtons";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/Input";
import { useAddInvoice } from "@/hooks/useAddInvoice";
import useUpdateInvoice from "@/hooks/useUpdateInvoice";
import { getInvoices } from "@/services/bill";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

type billType = {
  id?: number;
  name: string;
  quantity: number;
  paid_with: "cash" | "card" | "transfer" | "bank check";
  paid_by: string;
  amount: number;
  booking_id?: number;
  created_at?: string;
  paid_to?: string;
  updated_by: string;
  cbu?: number;
};

type UserData = { email: string; user_metadata: { fullName: string } };

export default function Invoice() {
  const userData = useQueryClient().getQueryData(["user"]) as UserData;
  const { email, user_metadata } = userData || {
    email: "",
    user_metadata: { fullName: "" },
  };

  const { register, reset, handleSubmit, setValue } = useForm<billType>();
  const billID = Number(useParams().billId);
  const isEditingSession = Boolean(billID);
  const [paid_by, setPaid_by] = useState("");
  const [isLoadingEquipment, setLoadingEquipment] = useState(
    Boolean(isEditingSession)
  );
  const { isAdding, addInvoice } = useAddInvoice();
  const { isUpdating, updateInvoice } = useUpdateInvoice();

  useEffect(() => {
    if (isEditingSession) {
      getInvoices(billID)
        .then((res = []) => {
          if (res && res.length !== 0) {
            const {
              name,
              quantity,
              paid_with,
              paid_by,
              amount,
              paid_to,
              updated_by,
              cbu,
            } = res[0];

            setValue("name", name);
            setValue("quantity", quantity);
            setValue("amount", amount);
            setValue("paid_by", paid_by);
            if (paid_to != null) {
              setValue("paid_to", paid_to);
            }
            setValue("paid_with", paid_with);
            if (cbu != null) {
              setValue("cbu", cbu);
            }
            setValue("updated_by", updated_by);
            setLoadingEquipment(false);
          }
        })
        .catch(() => {
          toast.error("Error al actualizar la factura");
        });
    }
  }, [billID, isEditingSession, setValue]);

  if (isLoadingEquipment) {
    return <Spinner />;
  }

  function onSubmit(data: billType) {
    const updatedBill = {
      id: billID,
      name: data.name,
      quantity: data.quantity,
      amount: Number(data.amount),
      paid_by: data.paid_by,
      paid_to: data.paid_to,
      paid_with: data.paid_with,
      updated_by: user_metadata.fullName != "" ? user_metadata.fullName : email,
      cbu: data.cbu,
    };

    const billData = {
      name: data.name,
      quantity: data.quantity,
      amount: Number(data.amount),
      paid_by: data.paid_by,
      paid_to: data.paid_to,
      paid_with: data.paid_with,
      updated_by: user_metadata.fullName != "" ? user_metadata.fullName : email,
      cbu: data.cbu,
    };

    if (isEditingSession) {
      updateInvoice(updatedBill);
    }
    if (!isEditingSession) {
      addInvoice(billData);
    }
    reset();
  }

  return (
    <AddLayout>
      <h1 className="text-2xl font-bold mb-4">
        {isEditingSession ? "Modificar gasto" : "Agregar gasto"}
      </h1>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2">
              Nombre
            </label>
            <Input
              type="text"
              id="name"
              {...register("name")}
              disabled={isEditingSession}
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2">
              Cantidad
            </label>
            <Input type="number" id="quantity" {...register("quantity")} />
          </div>
          <div>
            <label htmlFor="amount" className="block mb-2">
              Precio
            </label>
            <Input type="number" id="amount" {...register("amount")} />
          </div>
          <div>
            <label htmlFor="paid_by" className="block mb-2">
              Abonado por
            </label>
            <Input
              type="text"
              id="paid_by"
              {...register("paid_by")}
              placeholder="Nombre y apellido"
            />
          </div>
          <div>
            <label htmlFor="paid_to" className="block mb-2">
              Abonado a
            </label>
            <Input
              type="text"
              id="paid_to"
              {...register("paid_to")}
              placeholder="Nombre y apellido"
            />
          </div>
          <div>
            <label className="block mb-2">Abonado con</label>
            <select
              className="border rounded-md h-9 w-full"
              {...register("paid_with")}
              onBlur={(e) => {
                setPaid_by(e.target.value);
              }}
              defaultValue={paid_by}
              required
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="bank check">Cheque</option>
            </select>
          </div>
          <div>
            <label htmlFor="cbu" className="block mb-2">
              CBU
            </label>
            <Input
              type="number"
              id="cbu"
              {...register("cbu")}
              disabled={paid_by === "transfer" ? false : true}
            />
          </div>
          <div>
            <label className="block mb-2">Actualizado por</label>
            <Input
              type="text"
              id="updated_by"
              defaultValue={
                user_metadata.fullName != "" ? user_metadata.fullName : email
              }
              {...register("updated_by")}
              disabled
            />
          </div>
        </div>
        <NavigationButtons
          isAdding={isAdding || isUpdating}
          navigateTo="/gastos"
          addTitle={isEditingSession ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
