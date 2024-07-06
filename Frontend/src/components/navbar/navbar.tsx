import {
  HamburgerMenuIcon,
  HeartIcon,
  PersonIcon,
} from '@radix-ui/react-icons';

import logo from '../svg/logo.svg';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { hotelToken, logoutHotel, clientToken, logoutClient } = useAuth();

  return (
    <div className="w-screen shadow-lg text-secondary">
      <nav className="h-[5vh] w-full lg:w-3/4 lg:mx-auto  text-secondary">
        <div className="flex items-center justify-between h-full">
          <a
            href="/ "
            className="flex items-center hover:opacity-70 duration-300"
          >
            <img src={logo} alt="logo" className="h-auto w-28" />
            <h1 className="text-lg font-bold ml-2 sr-only">SeekSleep</h1>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center hover:opacity-70 duration-300"
            >
              <HeartIcon className="w-6 h-6" />
              <span className="ml-1">Favoritos</span>
            </a>

            <a
              href={hotelToken ? '/hotel/dashboard' : '/hotel/login'}
              className="flex items-center hover:opacity-70 duration-300"
            >
              <PersonIcon className="w-6 h-6" />
              {hotelToken ? (
                <span className="ml-1">Minha Conta</span>
              ) : (
                <span className="ml-1">Fazer Login Hotel</span>
              )}
            </a>

            <a
              href={clientToken ? '/user/dashboard' : '/user/login'}
              className="flex items-center hover:opacity-70 duration-300"
            >
              <PersonIcon className="w-6 h-6" />
              {clientToken ? (
                <span className="ml-1">Minha Conta</span>
              ) : (
                <span className="ml-1">Fazer Login User</span>
              )}
            </a>

            {hotelToken && (
              <button
                onClick={logoutHotel}
                className="bg-slate-600 py-1 px-2 text-white rounded flex items-center hover:opacity-70 duration-300"
              >
                <PersonIcon className="w-6 h-6" />
                <span className="ml-1">Sair Hotel</span>
              </button>
            )}

            {clientToken && (
              <button
                onClick={logoutClient}
                className="py-1 px-2 rounded flex items-center hover:opacity-70 duration-300"
              >
                <PersonIcon className="w-6 h-6" />
                <span className="ml-1">Sair</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
