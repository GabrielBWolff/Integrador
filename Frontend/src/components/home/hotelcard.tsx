import { Features } from '@/types/room.type';
import { AiOutlineSafety } from 'react-icons/ai';
import { BiDrink, BiEdit } from 'react-icons/bi';
import { CiDesktop } from 'react-icons/ci';
import { MdOutlineShower, MdOutlineBathroom } from 'react-icons/md';
import { PiTelevision, PiHairDryerLight } from 'react-icons/pi';
import { TbAirConditioning } from 'react-icons/tb';
import { RoomResponse } from '@/types/room.type';
import React from 'react';

const featureMapping: Record<
  keyof Features,
  { label: string; Icon: React.ElementType }
> = {
  beds: { label: 'Camas', Icon: BiEdit },
  shower: { label: 'Chuveiro', Icon: MdOutlineShower },
  bathroom: { label: 'Banheiro', Icon: MdOutlineBathroom },
  airConditioning: { label: 'Ar Condicionado', Icon: TbAirConditioning },
  minibar: { label: 'Minibar', Icon: BiDrink },
  safeBox: { label: 'Cofre', Icon: AiOutlineSafety },
  tv: { label: 'TV', Icon: PiTelevision },
  wifi: { label: 'Wi-Fi', Icon: CiDesktop },
  workDesk: { label: 'Mesa de Trabalho', Icon: CiDesktop },
  hairDryer: { label: 'Secador de Cabelo', Icon: PiHairDryerLight },
  view: { label: 'Vista', Icon: BiEdit },
};

const HotelCard: React.FC<{ roomData: RoomResponse }> = ({ roomData }) => {
  return (
    <a className="flex flex-col gap-2 shadow-lg" href={'/room/' + roomData.id}>
      <img
        src={'http://localhost:3000/public/images/' + roomData.images[0]}
        alt=""
        className="rounded-lg w-full h-[240px]"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src =
            'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
        }}
      />
      <h3 className="text-lg font-bold">{roomData.description}</h3>
      <p>Quarto número: {roomData.roomNumber}</p>
      <p>Capacidade máxima: {roomData.maxCapacity}</p>
      <p>
        Disponibilidade:{' '}
        {roomData.disponibility ? 'Disponível' : 'Indisponível'}
      </p>
      <div className="grid grid-cols-2 items-center gap-1 justify-center p-2">
        {Object.keys(roomData.features).map((feature, index) => {
          const featureKey = feature as keyof Features;
          if (!roomData.features[featureKey]) return null;

          return (
            <div key={index} className="flex items-center gap-2 text-blue-500">
              {featureMapping[featureKey]?.Icon && (
                <div className="text-blue-500 flex items-center gap-2">
                  {React.createElement(featureMapping[featureKey]?.Icon)}
                  <span>{featureMapping[featureKey]?.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </a>
  );
};

export default HotelCard;
