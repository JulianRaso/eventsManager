import toast from "react-hot-toast";
import { TableData, TableRow } from "../Table";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import { useState } from "react";

type EquipmentItem = {
  id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

type EquipmentItemProps = {
  stock: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  };
  bookingId: number;
  equipment: EquipmentItem[];
  setEquipment: (equipment: EquipmentItem[]) => void;
  setPrice: (price: (previous: number) => number) => void;
};

export default function EquipmentItem({
  stock,
  bookingId,
  equipment,
  setEquipment,
  setPrice,
}: EquipmentItemProps) {
  const [quantity, setQuantity] = useState(0);

  return (
    <TableRow>
      <TableData>{stock.name}</TableData>
      <TableData>{stock.quantity}</TableData>
      <TableData>{stock.price}</TableData>
      <TableData>
        <Input
          type="number"
          min={0}
          max={stock.quantity}
          value={quantity}
          disabled={Boolean(
            equipment
              .filter((item) => item.name === stock.name)
              .reduce((total, item) => total + item.quantity, 0) ===
              stock.quantity
          )}
          onChange={(e) => {
            if (e.target.value === "") {
              setQuantity(0);
              return;
            }
            const inputValue = Number(e.target.value);
            const usedQuantity = equipment
              .filter((item) => item.name === stock.name)
              .reduce((total, item) => total + item.quantity, 0);
            const availableQuantity = stock.quantity - usedQuantity;
            if (inputValue <= availableQuantity) {
              setQuantity(inputValue);
            }
          }}
        />
      </TableData>
      <TableData>
        <Button
          variant="outline"
          onClick={(e) => (
            e.preventDefault(),
            quantity === 0
              ? toast.error("Debe ingresar una cantidad")
              : quantity > stock.quantity
              ? toast.error("Cantidad no disponible")
              : quantity < 0
              ? toast.error("Cantidad no disponible")
              : (setEquipment([
                  ...equipment,
                  {
                    booking_id: bookingId,
                    equipment_id: stock.id,
                    name: stock.name,
                    quantity: quantity,
                    price: stock.price,
                  },
                ]),
                setPrice((previous) => previous + quantity * stock.price))
          )}
          disabled={Boolean(
            equipment
              .filter((item) => item.name === stock.name)
              .reduce((total, item) => total + item.quantity, 0) ===
              stock.quantity
          )}
        >
          +
        </Button>
      </TableData>
    </TableRow>
  );
}
