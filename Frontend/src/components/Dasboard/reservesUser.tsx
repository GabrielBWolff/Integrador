import { useEffect, useState } from 'react';
import Footer from '../footer/footer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { ReserveResponse } from '@/types/reserve.type';
import { getReservesUser } from '@/utils/Getter';
import { useToast } from '../ui/use-toast';

type Reservation = {
  id: number;
  userId: number;
  roomId: string;
  entryDate: Date;
  departureDate: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
};

type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'CheckedOut';

const statusOptions: ReservationStatus[] = [
  'Confirmed',
  'Pending',
  'Cancelled',
  'CheckedOut',
];

const statusMapping: {
  [key in ReservationStatus]: { label: string; color: string };
} = {
  Confirmed: { label: 'Confirmada', color: 'green' },
  Pending: { label: 'Pendente', color: 'orange' },
  Cancelled: { label: 'Cancelada', color: 'red' },
  CheckedOut: { label: 'Concluída', color: 'blue' },
};

export default function ReservationsUser() {
  const { toast } = useToast();
  const { clientToken } = useAuth();
  const [reservations, setReservations] = useState<ReserveResponse[]>();
  const [search, setSearch] = useState<string>('');

  const filteredReservations =
    reservations?.filter(reservation =>
      reservation.roomNumber.toString().includes(search)
    ) || [];

  const handleStatusChange = (id: number, newStatus: ReservationStatus) => {
    console.log(`Reserva ${id} atualizada para ${newStatus}`);
  };

  const handleEndReservation = (id: number) => {
    console.log(`Reserva ${id} encerrada`);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      if (!reservations) {
        const reserves = await getReservesUser(clientToken || '');
        if (
          Array.isArray(reserves) &&
          reserves.length > 0 &&
          typeof reserves[0] === 'string'
        ) {
          reserves.forEach(error => {
            toast({
              title: error as string,
              variant: 'destructive',
            });
          });
          return;
        }
        const typedReserves = reserves as ReserveResponse[];
        const updatedReserves: ReserveResponse[] = typedReserves.map(
          reserve => {
            reserve.entryDate = new Date(reserve.entryDate);
            reserve.departureDate = new Date(reserve.departureDate);

            return {
              ...reserve,
              entryDate: new Date(reserve.entryDate),
              departureDate: new Date(reserve.departureDate),
              status: (reserve.status.substring(0, 1).toUpperCase() +
                reserve.status.substring(1).toLowerCase()) as ReservationStatus,
            };
          }
        );

        console.log(updatedReserves);
        setReservations(updatedReserves);
      }
    };

    fetchReservations();

    console.log(reservations);
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="hidden">
        <div className="text-orange-500"></div>
      </div>
      <div className="mx-4 md:mx-auto md:w-3/5 mt-12 gap-2 flex flex-col">
        <div>
          <h2 className="text-2xl font-bold">Página de Reservas</h2>
          <p>Gerencie as reservas dos quartos no sistema</p>
        </div>

        <div className="flex gap-4 border border-gray-200 p-2 rounded-lg divide-x mt-4 shadow-lg">
          <Input
            placeholder="Buscar por número do quarto"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="shadow-none border-0 w-full"
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">Reservas</h2>
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quarto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saída
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Quarto {reservation.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(reservation.entryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(reservation.departureDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-${
                      statusMapping[reservation.status].color
                    }-500`}
                  >
                    {statusMapping[reservation.status].label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
