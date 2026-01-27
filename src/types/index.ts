// Tipos compartidos para la aplicación

// Client types
export interface ClientProps {
  dni: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

// Booking types
export type BookingStatus = "pending" | "cancel" | "confirm";
export type PaymentStatus = "pending" | "partially_paid" | "paid";
export type EventType =
  | "birthday"
  | "marriage"
  | "corporate"
  | "fifteen_party"
  | "other";
export type Organization = "Muzek" | "Show Rental";

export interface BookingProps {
  client_dni: number;
  booking_status: BookingStatus;
  comments: string;
  organization: Organization;
  event_date: string;
  event_type: EventType;
  payment_status: PaymentStatus;
  place: string;
  tax: number;
  revenue: number;
  price: number;
}

export interface BookedProps extends BookingProps {
  id: number;
}

// Stock/Inventory types
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

export interface StockProps {
  name: string;
  location: string;
  price: number;
  quantity: number;
  category: CategoryType;
  updated_by: string;
}

export interface StockedProps extends StockProps {
  id: number;
}

// Equipment item types
export interface EquipmentItemProps {
  id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
}

// User types
export interface UserProps {
  fullName?: string;
  email: string;
  password: string;
  avatar?: string;
}

// Filter option type
export interface FilterOption {
  value: string;
  label: string;
}
