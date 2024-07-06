import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext<{
  hotelToken: string | null;
  setHotelToken: (token: string) => void;
  updateHotelToken: (token: string) => void;
  logoutHotel: () => void;

  clientToken: string | null;
  setClientToken: (token: string) => void;
  updateClientToken: (token: string) => void;
  logoutClient: () => void;
}>({
  hotelToken: null,
  setHotelToken: () => {},
  logoutHotel: () => {},
  updateHotelToken: () => {},

  clientToken: null,
  setClientToken: () => {},
  updateClientToken: () => {},
  logoutClient: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [hotelToken, setHotelToken] = useState<string | null>(
    localStorage.getItem('hotelToken')
  );
  const [clientToken, setClientToken] = useState<string | null>(
    localStorage.getItem('clientToken')
  );

  const updateHotelToken = (token: string) => {
    localStorage.setItem('hotelToken', token);
    setHotelToken(token);
  };

  const logoutHotel = () => {
    updateHotelToken('');
  };

  const updateClientToken = (token: string) => {
    localStorage.setItem('clientToken', token);
    setClientToken(token);
  };

  const logoutClient = () => {
    setClientToken(null);
    localStorage.setItem('clientToken', '');
  };

  return (
    <AuthContext.Provider
      value={{
        updateClientToken,
        clientToken,
        hotelToken,
        logoutClient,
        logoutHotel,
        setClientToken,
        setHotelToken,
        updateHotelToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
