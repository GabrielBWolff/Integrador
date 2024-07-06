import { validateTokenClient } from '@/utils/Getter';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { stat } from 'fs';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/context/AuthContext';

type ChildrenProps = {
  children: JSX.Element;
};

export default function PrivateClient({ children }: ChildrenProps) {
  const navigate = useNavigate();
  const { clientToken, logoutClient } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function validate(token: string) {
      const status = await validateTokenClient(token);
      if (Array.isArray(status)) {
        // logoutClient();
        toast({
          title: 'Token inválido ou expirado',
          variant: 'destructive',
          duration: 2500,
        });
        navigate('/user/login');
        return;
      }
    }

    validate(clientToken || '');
  }, [clientToken]);

  return <>{children}</>;
}
