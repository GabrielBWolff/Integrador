import express from 'express';

import {
  avaible,
  index,
  indexAll,
  store,
  update,
  destroy,
  getById,
  indexByParams,
} from '../controllers/room.controller.js';
import { HotelLoginMidddleware } from '../middleware/hotel.midddleware.js';
const router = express.Router();

router.get('/', HotelLoginMidddleware, index);
router.get('/all', indexAll);
router.post('/', HotelLoginMidddleware, store);
router.post('/', HotelLoginMidddleware, store);
router.put('/', HotelLoginMidddleware, update);
router.delete('/', HotelLoginMidddleware, destroy);
router.get('/avaible', avaible);
router.get('/:roomId', getById);
router.post('/search', indexByParams);

export default router;
