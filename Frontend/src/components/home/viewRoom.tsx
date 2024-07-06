import React, { useEffect, useState } from 'react';
import { RoomResponse, featureMapping } from '@/types/room.type';
import { useParams } from 'react-router-dom';
import { getRoomById, validateTokenClient } from '@/utils/Getter';
import { ReservationDialog } from './reserveDialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/use-toast';
import { UserResponse } from '@/types/user.type';

export default function ViewRoom() {
  const { clientToken } = useAuth();
  const { toast } = useToast();
  const { id } = useParams();
  const [room, setRoom] = useState<RoomResponse | undefined>();
  const [user, setuser] = useState<UserResponse | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const fetchedRoom = await getRoomById(id!);
        if (Array.isArray(fetchedRoom)) {
          {
            fetchedRoom.forEach(error => {
              toast({
                title: error,
                variant: 'destructive',
              });
            });
            return;
          }
        }
        setRoom(fetchedRoom);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      const fetchedUser = await validateTokenClient(clientToken || '');
      if (Array.isArray(fetchedUser)) {
        {
          fetchedUser.forEach(error => {
            toast({
              title: error,
              variant: 'destructive',
            });
          });
          return;
        }
      }
      setuser(fetchedUser as UserResponse);
    };

    if (!room) {
      fetchRoom();
      fetchUser();
    }
  }, [id, room]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-4">
            Detalhes do Quarto {room?.roomNumber}
          </h1>
          <p className="text-gray-600 mb-6">{room?.description}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Características:</h2>
            <div className="flex flex-wrap">
              {Object.keys(room?.features || []).map(featureKey => {
                const key = featureKey as keyof typeof featureMapping;
                const FeatureIcon = featureMapping[key]?.Icon;
                const featureLabel = featureMapping[key]?.label;

                if (FeatureIcon && featureLabel && room?.features[key]) {
                  return (
                    <div
                      key={featureKey}
                      className="flex items-center mr-4 mb-2"
                    >
                      <FeatureIcon className="h-5 w-5 mr-1 text-gray-700" />
                      <span>{featureLabel}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Imagens:</h2>
            <div className="grid grid-cols-4 gap-2 flex-wrap justify-center">
              {room?.images?.length === 0 && (
                <img
                  src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                  alt=""
                  className="w-full h-48"
                />
              )}
              {room?.images?.map((image: string, index) => (
                <img
                  key={index}
                  src={'http://localhost:3000/public/images/' + image}
                  alt={`Imagem do quarto ${room?.roomNumber}`}
                  className="w-full h-48 object-cover rounded-md mr-2 mb-2"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-800 font-semibold">
              Preço por dia: R$ {room?.pricePerDay}
            </p>
            <ReservationDialog
              userData={user}
              roomId={id!}
              token={clientToken!}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
