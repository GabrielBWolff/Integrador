import { useAuth } from '@/context/AuthContext';
import { Room, featureMapping } from '@/types/room.type';
import { CiCirclePlus } from 'react-icons/ci';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import RegisterRoomModal from './includes/registerRoomForm';
import { deleteRoom, getRooms } from '@/utils/Getter';
import { useToast } from '../ui/use-toast';
import EditRoomModal from './includes/editRoomForm';

export default function Dashboard() {
  const { toast } = useToast();
  const { hotelToken } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtredRooms, setFiltredRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();

  const fetchRooms = async () => {
    if (!rooms || rooms.length === 0) {
      const rooms = await getRooms(hotelToken!);
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
      setRooms(rooms as Room[]);

      const filtred: Room[] = [];
      for(const room of rooms as Room[]) {
        if(room.roomNumber.toString().includes(search)) filtred.push(room)
      }

      setFiltredRooms(filtred);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="overflow-hidden h-[95vh]">
      {isModalOpen && (
        <RegisterRoomModal
          setRooms={setFiltredRooms}
          rooms={rooms || []}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="lg:mx-auto w-[calc(100vw-56px)] ml-16 p-2 lg:w-3/5 mt-12 gap-2 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Hotéis</h2>
          <p>Gerencie os quartos cadastrados no sistema</p>
        </div>

        <div className="flex gap-4 border border-gray-200 p-2 rounded-lg divide-x mt-4 shadow-lg">
          <Input
            placeholder="Buscar por número do quarto"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="shadow-none border-0 w-full"
          />
        </div>

        <div className="mt-8 overflow-y-scroll h-[400px]">
          <h2 className="text-2xl font-bold">Quartos Cadastrados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div
              className="flex items-center justify-center p-4 border border-dashed rounded-lg cursor-pointer"
              onClick={handleAddRoom}
            >
              <CiCirclePlus className="w-8 h-8 text-blue-500" />
              <span className="ml-2">Adicionar Quarto</span>
            </div>
            {filtredRooms.map((room) => {
              return (
                <div
                  key={room.id}
                  className="flex flex-col gap-2 shadow-lg p-4 rounded-lg border"
                >
                  <h3 className="text-lg font-bold">
                    Quarto {room.roomNumber}
                  </h3>
                  <p>Descrição: {room.description}</p>
                  <p>Capacidade Máxima: {room.maxCapacity}</p>
                  <p>
                    Disponibilidade:{' '}
                    {room.disponibility ? 'Disponível' : 'Ocupado'}
                  </p>
                  <p>Características:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(room.features).map(([key, value]) => {
                      const feature =
                        featureMapping[key as keyof typeof featureMapping];
                      if (!feature) return null;
                      const { label, Icon } = feature;
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 tooltip"
                        >
                          <div className="flex items-center gap-2 relative group">
                            <Icon
                              className={`w-5 h-5 ${
                                value ? 'text-blue-500' : 'text-red-500'
                              }`}
                            />
                            <span>{label}</span>
                            <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-max bg-black text-white text-xs rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white w-full" onClick={() => setSelectedRoom(room)}>
                      Editar
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white w-full"
                      onClick={async () => {
                        await deleteRoom(hotelToken!, room.id);
                        setFiltredRooms(filtredRooms?.filter(r => r.id !== room.id));
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {
        selectedRoom && (
          <EditRoomModal initialData={selectedRoom} rooms={rooms} setRooms={setFiltredRooms} setIsModalOpen={setIsModalOpen} isModalOpen={selectedRoom ? true : false} setSelected={setSelectedRoom}/>
        )
      }
      {/* <Footer /> */}
    </div>
  );
}
