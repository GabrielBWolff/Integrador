import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const Hotelschema = z.object({
  name: z.string().nonempty({ message: "Por favor, insira um nome válido." }),
  email: z.string().email({ message: "Insira um email válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  cep: z.string().length(8, {
    message: "CEP deve ter 8 caracteres",
  }),
  number: z.string(),
  description: z.string(),
  features: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "Você deve selecionar ao menos uma feature",
    })
    .default([]),
  phone: z
    .string({
      required_error: "Telefone é obrigatório",
    })
    .length(11, {
      message: "Telefone deve ter 11 dígitos",
    })
    .regex(/^(\d{2})(\d{5})(\d{4})/, {
      message: "Telefone inválido",
    }),
});

const featuresOptionsHotel = [
  {
    key: "Wifi",
    id: "hasWiFi",
  },
  {
    key: "Estacionamento",
    id: "hasParking",
  },
  {
    key: "Piscina",
    id: "hasPool",
  },
  {
    key: "Academia",
    id: "hasGym",
  },
  {
    key: "Restaurante",
    id: "hasRestaurant",
  },
  {
    key: "Bar",
    id: "hasBar",
  },
  {
    key: "Spa",
    id: "hasSpa",
  },
  {
    key: "Room Service",
    id: "hasRoomService",
  },
  {
    key: "Salas de Conferência",
    id: "hasConferenceRooms",
  },
] as const;

const HotelLoginSchema = z.object({
  email: z.string().email({ message: "Insira um email válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type Hotel = z.infer<typeof Hotelschema>;
export type HotelLogin = z.infer<typeof HotelLoginSchema>;

export { Hotelschema, HotelLoginSchema, featuresOptionsHotel };
