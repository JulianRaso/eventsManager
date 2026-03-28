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

export interface InventoryProps {
  name: string;
  location: string;
  price: number;
  quantity: number;
  category: CategoryType;
  updated_by: string;
}

export interface InventoriedProps extends InventoryProps {
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

// Booking API response record
export interface BookingRecord {
  id?: number;
  created_at: string;
  client_dni: number;
  event_date: string;
  event_type: EventType;
  organization: Organization;
  place: string;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  comments: string;
  tax: number;
  revenue: number;
  price: number;
}

// Bill / expense form type
export interface BillType {
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
}

// Personal / Staff types
export type PersonalRole =
  | "tecnico"
  | "sonidista"
  | "iluminador"
  | "chofer"
  | "coordinador"
  | "otro";

export interface PersonalProps {
  name: string;
  lastName: string;
  dni?: number;
  phoneNumber?: string;
  role: PersonalRole;
  daily_rate: number;
  notes?: string;
}

export interface PersonaledProps extends PersonalProps {
  id: number;
  created_at?: string;
}

// Booking ↔ Personal assignment types
export interface AssignmentProps {
  booking_id: number;
  personal_id: number;
  days: number;
  rate: number;
  notes?: string;
}

export interface AssignedProps extends AssignmentProps {
  id: number;
  created_at?: string;
  personal?: {
    name: string;
    lastName: string;
    role: PersonalRole;
  };
}

// Authenticated user data (from query cache)
export interface UserData {
  email: string;
  user_metadata: { fullName: string };
}
