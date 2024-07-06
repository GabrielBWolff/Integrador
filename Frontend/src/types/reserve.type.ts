type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'checkedout';

export type ReserveResponse = {
  createdAt: Date;
  updatedAt: Date;
  status: ReservationStatus;
  id: number;
  userId: number;
  roomId: string;
  roomNumber: number;
  entryDate: Date;
  departureDate: Date;
};
