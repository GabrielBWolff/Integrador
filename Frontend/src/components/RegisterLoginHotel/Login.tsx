import { useAuth } from '@/context/AuthContext';
import { loginHotelPost } from '@/utils/Getter';
import Login from '../Login';

export default function LoginHotel() {
  const { updateHotelToken } = useAuth();

  return (
    <Login
      loginFunction={loginHotelPost}
      updateLogin={updateHotelToken}
      registerRedirect="/hotel/register"
    />
  );
}
