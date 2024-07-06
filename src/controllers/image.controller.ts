import { RequestHandler } from 'express';
import { unlinkSync } from 'fs';
import Hotel from '../models/Hotel.js';
import Image from '../models/Image.js';
import { errorResponse, response } from '../utils/response.js';
import Room from '../models/Room.js';

const hotelImageAdd: RequestHandler = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const hotel = Hotel.findByPk(hotelId);
    console.log(hotelId);
    if (!hotel) throw new Error('Hotel not found');
    if (!req.files || req.files.length === 0)
      throw new Error('Images are required');
    const files = req.files as Express.Multer.File[];
    const imagesName = files.map(item => item.filename);
    const toCreate = imagesName.map(item =>
      Image.create({
        referenceId: hotelId,
        imagePath: item,
      })
    );
    const images = await Promise.all(toCreate);
    return response(res, { status: 200, data: images });
  } catch (error) {
    const files = req.files as Express.Multer.File[];
    if (files.length > 0)
      files.forEach(item => {
        unlinkSync(item.path);
      });
    return errorResponse(res, error);
  }
};

const roomImageAdd: RequestHandler = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = Room.findByPk(roomId);
    if (!room) throw new Error('Room not found');
    if (!req.files || req.files.length === 0)
      throw new Error('Images are required');
    const files = req.files as Express.Multer.File[];
    const imagesName = files.map(item => item.filename);
    const toCreate = imagesName.map(item =>
      Image.create({
        referenceId: roomId,
        imagePath: item,
      })
    );
    const images = await Promise.all(toCreate);
    return response(res, { status: 200, data: images });
  } catch (error) {
    const files = req.files as Express.Multer.File[];
    if (files.length > 0)
      files.forEach(item => {
        unlinkSync(item.path);
      });
    return errorResponse(res, error);
  }
};

const index: RequestHandler = async (req, res) => {
  try {
    const images = await Image.findAll();
    return response(res, { status: 200, data: images });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export { hotelImageAdd, roomImageAdd, index };
