import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserResponse } from '@/types/user.type';
import { useToast } from '../ui/use-toast';
import { userReservePost } from '@/utils/Getter';

type FormData = {
  name: string;
  email: string;
  checkin: string;
  checkout: string;
  roomId: string;
  userId: string;
};

type ReservationDialogProps = {
  userData?: UserResponse;
  roomId: string;
  token: string;
};

export function ReservationDialog({
  userData,
  roomId,
  token,
}: ReservationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: userData?.name || '',
    email: userData?.email || '',
    checkin: '',
    checkout: '',
    roomId: roomId,
    userId: userData?.id.toString() || '',
  });

  const handleSubmit = async () => {
    try {
      if (formData.checkin.length === 0 || formData.checkout.length === 0) {
        toast({
          title: 'Por favor, preencha todas as informações',
          variant: 'destructive',
        });
        return;
      }

      const response = await userReservePost(formData, token);
      if (Array.isArray(response)) {
        response.forEach(error => {
          toast({
            title: error,
            variant: 'destructive',
          });
        });
        return;
      }
      toast({
        title: 'Reserva feita com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao enviar a reserva:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => setOpen(!open)}>
        <Button
          variant="outline"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Fazer uma Reserva
        </Button>
      </DialogTrigger>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
            <DialogDescription>
              Por favor, insira os detalhes da sua reserva abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.name}
                disabled
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkin" className="text-right">
                Data de Check-in
              </Label>
              <Input
                type="date"
                id="checkin"
                value={formData.checkin}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkout" className="text-right">
                Data de Check-out
              </Label>
              <Input
                type="date"
                id="checkout"
                value={formData.checkout}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid-cols-4 items-center gap-4 hidden">
              <Input
                type="number"
                id="hospedes"
                value={formData.roomId}
                hidden
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid-cols-4 items-center gap-4 hidden">
              <Input
                type="number"
                id="hospedes"
                hidden
                value={formData.userId}
                disabled
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={async () => {
                await handleSubmit();
              }}
            >
              Confirmar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
