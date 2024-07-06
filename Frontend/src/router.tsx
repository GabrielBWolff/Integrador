import { createBrowserRouter } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import MotionWrapper from './components/router/wrappers/HorizontalEntry';
import PrivateHotel from './components/router/privateHotel';
import Home from './components/home/home';
import RegisterHotel from './components/RegisterLoginHotel/Register';
import Dashboard from './components/Dasboard/rooms';
import Reservations from './components/Dasboard/reserves';
import SideBar from './components/sidebar/sidebar';
import ViewRoom from './components/home/viewRoom';
import { loginHotelPost } from './utils/Getter';
import Login from './components/RegisterLoginHotel/Login';
import LoginUser from './components/RegisterLoginUser/Login';
import RegisterUser from './components/RegisterLoginUser/Register';
import PrivateClient from './components/router/privateClient';
import ReservationsUser from './components/Dasboard/reservesUser';
import LoginHotel from './components/RegisterLoginHotel/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="overflow-hidden">
        <Navbar />
        <MotionWrapper>
          <Home />
        </MotionWrapper>
      </div>
    ),
  },
  {
    path: '/room/:id',
    element: (
      <PrivateClient>
        <div className="overflow-hidden">
          <Navbar />
          <MotionWrapper>
            <ViewRoom />
          </MotionWrapper>
        </div>
      </PrivateClient>
    ),
  },
  {
    path: '/hotel/register',
    element: (
      <div className="overflow-hidden">
        <Navbar />
        <MotionWrapper>
          <RegisterHotel />
        </MotionWrapper>
      </div>
    ),
  },
  {
    path: '/hotel/login',
    element: (
      <>
        <Navbar />
        <MotionWrapper>
          <LoginHotel />
        </MotionWrapper>
      </>
    ),
  },
  {
    path: '/user/login',
    element: (
      <>
        <Navbar />
        <MotionWrapper>
          <LoginUser />
        </MotionWrapper>
      </>
    ),
  },
  {
    path: '/user/register',
    element: (
      <>
        <Navbar />
        <MotionWrapper>
          <RegisterUser />
        </MotionWrapper>
      </>
    ),
  },
  {
    path: '/hotel/dashboard',
    children: [
      {
        path: '',
        element: (
          <PrivateHotel>
            <MotionWrapper>
              <div className="overflow-hidden">
                <SideBar />
                <Navbar />
                <Reservations />
              </div>
            </MotionWrapper>
          </PrivateHotel>
        ),
      },
      {
        path: 'home',
        element: (
          <PrivateHotel>
            <MotionWrapper>
              <div className="overflow-hidden">
                <SideBar />
                <Navbar />
                <Reservations />
              </div>
            </MotionWrapper>
          </PrivateHotel>
        ),
      },
      {
        path: 'rooms',
        element: (
          <PrivateHotel>
            <MotionWrapper>
              <div className="">
                <SideBar />
                <Navbar />
                <Dashboard />
              </div>
            </MotionWrapper>
          </PrivateHotel>
        ),
      },
    ],
  },
  {
    path: '/user/dashboard',
    children: [
      {
        path: '',
        element: (
          <PrivateClient>
            <MotionWrapper>
              <div className="overflow-hidden">
                <Navbar />
                <ReservationsUser key={'UserReserves'} />
              </div>
            </MotionWrapper>
          </PrivateClient>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]);

export default router;
