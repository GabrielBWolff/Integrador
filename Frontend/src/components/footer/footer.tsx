import logo from '@/components/svg/logo.svg';
import { useAuth } from '@/context/AuthContext';
import { PersonIcon } from '@radix-ui/react-icons';

export default function Footer() {
  const { hotelToken } = useAuth();

  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-2 mt-40">
      <div className="w-full max-w-screen-xl mx-auto p-2 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src={logo} className="h-8" alt="Logotipo do Flowbite" />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licenciamento
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contato
              </a>
            </li>

            <li className="hidden md:block">
              <span className="mx-4">|</span>
            </li>

            <li>
              <a href="#" className="hover:underline">
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
              </a>
            </li>

            <li>
              <a href="#" className="hover:underline">
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
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024. Todos os Direitos Reservados.
        </span>
      </div>
    </footer>
  );
}
