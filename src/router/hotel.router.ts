import express from 'express';

import { index, store, login, put } from '../controllers/hotel.controller.js';
import { HotelLoginMidddleware } from '../middleware/hotel.midddleware.js';

const router = express.Router();

router.get('/', HotelLoginMidddleware, index);
router.post('/', store);
router.post('/login', login);
router.put('/', HotelLoginMidddleware, put);

export default router;
