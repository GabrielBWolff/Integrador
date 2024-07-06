import { validateTokenHotel } from '@/utils/Getter';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { stat } from 'fs';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/context/AuthContext';

type ChildrenProps = {
  children: JSX.Element;
};

export default function PrivateHotel({ children }: ChildrenProps) {
  const navigate = useNavigate();
  const { hotelToken, logoutHotel } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function validate(token: string) {
      const status = await validateTokenHotel(token);
      if (!status) {
        logoutHotel();
        toast({
          title: 'Token inválido ou expirado',
          variant: 'destructive',
          duration: 2500,
        });
        navigate('/hotel/login');
        return;
      }
    }

    validate(hotelToken || '');
  }, [hotelToken]);

  return <>{children}</>;
}
