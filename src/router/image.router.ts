import express from 'express';
import multer from 'multer';
import {
  hotelImageAdd,
  roomImageAdd,
  index,
} from '../controllers/image.controller.js';
import { HotelLoginMidddleware } from '../middleware/hotel.midddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post(
  '/upload/hotel',
  upload.array('images'),
  HotelLoginMidddleware,
  hotelImageAdd
);

router.post(
  '/upload/room',
  upload.array('images'),
  HotelLoginMidddleware,
  roomImageAdd
);

router.get('/', index);

export default router;
