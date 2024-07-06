import { cn } from '@/lib/utils';
import {
  HamburgerMenuIcon,
  IconJarLogoIcon,
  MoonIcon,
} from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function SideBar() {
  const { logoutHotel } = useAuth();
  const location = useLocation();
  const lastPath =
    location.pathname.split('/')[location.pathname.split('/').length - 1];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={cn(
        'fixed top-0 z-50 flex-col left-0 w-64 bg-white h-screen border-r shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hidden lg:flex',
        isOpen ? '' : 'w-16'
      )}
      initial={{ x: '100%' }}
      animate={{ x: !isOpen ? 0 : '0%' }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        width: isOpen ? '16rem' : '4rem',
        transition: 'width 0.3s ease',
      }}
    >
      <a
        className="flex items-center justify-center h-14 gap-2 relative w-full mx-auto border-0"
        href="#"
      >
        <MoonIcon
          className="w-8 h-8 text-zinc-600"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (
          <h4 className="text-lg font-medium text-zinc-600">SeekSleep</h4>
        )}
        {isOpen && (
          <HamburgerMenuIcon
            className="w-6 h-6 text-gray-500 absolute right-4"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </a>
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          <li className="px-5">
            <div className="flex flex-row items-center h-8">
              {isOpen && (
                <div className="text-sm font-light tracking-wide text-gray-500">
                  Menu
                </div>
              )}
            </div>
          </li>
          <li>
            <a
              href="/hotel/dashboard/"
              className={cn(
                'relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-zinc-500 pr-6',
                lastPath === 'dashboard' || lastPath === 'home'
                  ? 'bg-gray-50 text-gray-800 border-l-4 border-zinc-500 pointer-events-none'
                  : ''
              )}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Reservas
              </span>
            </a>
          </li>
          <li>
            <a
              href="/hotel/dashboard/rooms"
              className={cn(
                'relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-zinc-500 pr-6',
                lastPath === 'reserves'
                  ? 'bg-gray-50 text-gray-800 border-l-4 border-zinc-500 pointer-events-none'
                  : ''
              )}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Quartos
              </span>
            </a>
          </li>

          <li>
            <a
              onClick={logoutHotel}
              href="#"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-zinc-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
