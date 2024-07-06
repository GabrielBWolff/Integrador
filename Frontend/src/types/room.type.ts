import { LuBedSingle } from 'react-icons/lu';
import { MdOutlineShower, MdOutlineBathroom } from 'react-icons/md';
import { TbAirConditioning } from 'react-icons/tb';
import { BiDrink } from 'react-icons/bi';
import { AiOutlineSafety } from 'react-icons/ai';
import { FaGlasses } from 'react-icons/fa';
import { PiTelevision } from 'react-icons/pi';
import { CiDesktop } from 'react-icons/ci';
import { PiHairDryerLight } from 'react-icons/pi';
import { CiCirclePlus } from 'react-icons/ci';
import { number, z } from 'zod';
import { create } from 'domain';

const featureMapping: Record<
  keyof Features,
  { label: string; Icon: React.ElementType }
> = {
  shower: { label: 'Chuveiro', Icon: MdOutlineShower },
  bathroom: { label: 'Banheiro', Icon: MdOutlineBathroom },
  airConditioning: { label: 'Ar Condicionado', Icon: TbAirConditioning },
  minibar: { label: 'Minibar', Icon: BiDrink },
  safeBox: { label: 'Cofre', Icon: AiOutlineSafety },
  tv: { label: 'TV', Icon: PiTelevision },
  wifi: { label: 'Wi-Fi', Icon: CiDesktop },
  workDesk: { label: 'Mesa de Trabalho', Icon: CiDesktop },
  hairDryer: { label: 'Secador de Cabelo', Icon: PiHairDryerLight },
};

export type Features = {
  shower: boolean;
  bathroom: boolean;
  airConditioning: boolean;
  minibar: boolean;
  safeBox: boolean;
  tv: boolean;
  wifi: boolean;
  workDesk: boolean;
  hairDryer: boolean;
};

const RoomSchema = z.object({
  id: z.number().int().positive('ID deve ser um número positivo').optional(),
  hotelId: z.string().optional(),
  disponibility: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  roomNumber: z
    .number()
    .int()
    .positive('Número do quarto deve ser um número positivo')
    .min(1, 'Número do quarto deve ser maior que 0'),
  description: z.string(),
  maxCapacity: z
    .number()
    .int()
    .positive('Capacidade máxima deve ser um número positivo')
    .min(1, 'Capacidade máxima deve ser maior que 0'),
  photos: z.array(z.instanceof(File)).optional(),
  features: z.object({
    shower: z.boolean(),
    bathroom: z.boolean(),
    airConditioning: z.boolean(),
    minibar: z.boolean(),
    safeBox: z.boolean(),
    tv: z.boolean(),
    wifi: z.boolean(),
    workDesk: z.boolean(),
    hairDryer: z.boolean(),
  }),
  pricePerDay: z
    .number()
    .int()
    .positive('Preço por dia deve ser um número positivo'),
});

export type RoomResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  disponibility: boolean;
  roomNumber: number;
  maxCapacity: number;
  description: string;
  features: Features;
  hotelId: string;
  images: string[];
  pricePerDay: number;
};

export type Room = z.infer<typeof RoomSchema>;

export { RoomSchema, featureMapping };
