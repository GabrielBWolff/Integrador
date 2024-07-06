import express from 'express';

import cors from 'cors';

import userRoutes from './router/user.router.js';
import hotelRoutes from './router/hotel.router.js';
import roomRoutes from './router/room.router.js';
import imageRoutes from './router/image.router.js';
import reserveRoutes from './router/reserve.router.js';

class App {
  app: express.Application;

  constructor() {
    this.app = express();
    this.configure();
    this.routers();
  }

  routers() {
    this.app.use('/user', userRoutes);
    this.app.use('/hotel', hotelRoutes);
    this.app.use('/room', roomRoutes);
    this.app.use('/image', imageRoutes);
    this.app.use('/reserve', reserveRoutes);
  }

  configure() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('*', cors());
    this.app.use('/public', express.static('public'));
  }
}

export default new App().app;
