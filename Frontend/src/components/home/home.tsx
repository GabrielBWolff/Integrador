import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Footer from '../footer/footer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { Room, RoomResponse } from '@/types/room.type';
import { useEffect, useState } from 'react';
import { getAllRooms, getRoomsByParams } from '@/utils/Getter';
import HotelCard from './hotelcard';
import { useToast } from '../ui/use-toast';

export default function Home() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<RoomResponse[]>();

  const fetchRooms = async () => {
    if (!rooms) {
      const rooms = await getAllRooms();
      if (rooms.length > 0 && typeof rooms[0] === 'string') {
        const roomsString = rooms as string[];
        roomsString.forEach(error => {
          toast({
            title: error,
            variant: 'destructive',
          });
        });
        return;
      }

      setRooms(rooms as RoomResponse[]);
    }
  };

  const handleSearch = async () => {
    // Obter os valores dos inputs
    const destination =
      (document.getElementById('destination') as HTMLInputElement) || null;
    const checkin =
      (document.getElementById('checkin') as HTMLInputElement) || null;
    const checkout =
      (document.getElementById('checkout') as HTMLInputElement) || null;

    if (
      !destination ||
      destination.value === '' ||
      !checkin ||
      checkin.value === '' ||
      !checkout ||
      checkout.value === ''
    ) {
      toast({
        title: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }

    const requestData = {
      destination: destination.value,
      checkin: checkin.value,
      checkout: checkout.value,
    };

    const data = await getRoomsByParams(requestData);
    if (data.length > 0 && typeof data[0] === 'string') {
      const dataString = data as string[];
      dataString.forEach(error => {
        toast({
          title: error,
          variant: 'destructive',
        });
      });
      return;
    }

    setRooms(data as RoomResponse[]);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="mx-4 md:mx-auto md:w-3/5 mt-12 gap-2 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold">
            Comparamos preços de hotéis de centenas de sites
          </h2>
          <p>A gente busca, você economiza.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 border border-gray-200 p-2 rounded-lg divide-y sm:divide-y-0 sm:divide-x mt-4 shadow-lg">
          <Input
            id="destination"
            placeholder="Digite o destino"
            className="shadow-none border-0 sm:w-1/4 w-full"
            Icon={MagnifyingGlassIcon}
          />
          <div className="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x w-full sm:w-3/5">
            <Input
              id="checkin"
              placeholder="Data de entrada"
              className="shadow-none border-0 w-full sm:w-1/2 m-2 md:m-0"
              type="date"
            />
            <Input
              id="checkout"
              placeholder="Data de saída"
              className="shadow-none border-0 w-full sm:w-1/2 m-2 md:m-0"
              type="date"
            />
          </div>
          <Button
            className="py-2 px-8 bg-blue-500 text-white rounded w-full sm:w-auto mt-2 sm:mt-0"
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>

        <div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mt-8">
              Destinos mais bem avaliados
            </h2>
            <p>Confira os destinos mais bem avaliados pelos nossos usuários</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {rooms?.map(room => HotelCard({ roomData: room }))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
