export type PropertyCategory = "Casa" | "Apartamento" | "Bodega" | "Terreno";
export type PropertyStatus = "venta" | "renta";

export interface Property {
  id: string;
  title: string;
  price: string;
  category: PropertyCategory;
  status: PropertyStatus;
  department: string;
  municipio: string;
  details: string[];
  amenities: string[];
  image: string;
  images: string[];
  whatsappText?: string;
  hidden?: boolean;
  featured?: boolean;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  property?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}
