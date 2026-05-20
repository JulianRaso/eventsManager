export type eventData = {
    dni: number;
    name: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    organization: "Muzek" | "Show Rental";
    event_type: "birthday" | "marriage" | "corporate" | "fifteen_party" | "other";
    place: string;
    event_date: string;
    start_time?: string | null;
    end_time?: string | null;
    booking_status: "pending" | "cancel" | "confirm";
    payment_status: "pending" | "partially_paid" | "paid";
    comments: string;
    tax: number;
    price: number;
  };
  
export type CategoryType =
    | "lights"
    | "ambientation"
    | "sound"
    | "structure"
    | "tools"
    | "cables"
    | "others"
    | "furniture"
    | "screen";
  
export type EquipmentItem = {
    id?: number;
    booking_id: number;
    equipment_id: number;
    name: string;
    quantity: number;
    price: number;
  };