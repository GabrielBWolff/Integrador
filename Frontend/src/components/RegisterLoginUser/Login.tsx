import { useAuth } from '@/context/AuthContext';
import Login from '../Login';
import { loginUserPost } from '@/utils/Getter';

export default function LoginUser() {
  const { updateClientToken } = useAuth();

  return (
    <Login
      loginFunction={loginUserPost}
      updateLogin={updateClientToken}
      registerRedirect="/user/register"
    />
  );
}
