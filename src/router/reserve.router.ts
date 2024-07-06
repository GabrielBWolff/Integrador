import express from 'express';
import {
  changeReserveStatus,
  indexReserves,
  reserveRoom,
  roomsUpdateDisponibility,
  indexReservesUser,
} from '../controllers/reserve.controller.js';
import { HotelLoginMidddleware } from '../middleware/hotel.midddleware.js';
import { UserLoginMidddleware } from '../middleware/user.midddleware.js';

const router = express.Router();

router.get('/', HotelLoginMidddleware, indexReserves);
router.post('/', UserLoginMidddleware, reserveRoom);
router.get('/user', UserLoginMidddleware, indexReservesUser);
router.put('/', HotelLoginMidddleware, changeReserveStatus);
router.put('/disponibility', HotelLoginMidddleware, roomsUpdateDisponibility);

export default router;
