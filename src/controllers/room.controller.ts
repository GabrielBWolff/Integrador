import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import { addError, errorResponse, response } from '../utils/response.js';
import { RequestHandler } from 'express';
import Image from '../models/Image.js';
import { Op, Sequelize } from 'sequelize';

const store: RequestHandler = async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.body.hotelId);
    if (!hotel) throw new Error('Hotel not found');
    const room = await Room.create({
      ...req.body,
      hotelId: hotel.id,
    });
    return response(res, { status: 201, data: room });
  } catch (error) {
    return errorResponse(res, error);
  }
};

type IdToHotel = {
  [id: string]: Hotel
}

const index: RequestHandler = async (req, res) => {
  try {
    const rooms = await Room.findByHotelId(req.body.hotelId);
    const hotelProcessed: IdToHotel = {};

    const toReturn: (Room & { images: string[] } & { address: string })[] = [];
    for (const room of rooms) {
      if(!hotelProcessed[room.hotelId]) {
        const hotel = await Hotel.findOne({where: {id: room.hotelId}});
        hotelProcessed[room.hotelId] = hotel!;
      }
      const roomImages = await Image.findAll({
        where: { referenceId: room.id },
      });

      toReturn.push({
        ...room.dataValues,
        images: roomImages.map(i => i.imagePath),
        address: hotelProcessed[room.hotelId].address
      } as Room & {
        images: string[];
        address: string;
      });
    }

    return response(res, { status: 200, data: toReturn });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const indexByParams: RequestHandler = async (req, res) => {
  const { destination, checkin, checkout } = req.body;

  try {
    if (!destination || !checkin || !checkout)
      return response(res, {
        status: 400,
        errors: [
          addError(
            'destination',
            destination ? destination : 'Campo obrigatório'
          ),
          addError('checkin', checkin ? checkin : 'Campo obrigatório'),
          addError('checkout', checkout ? checkout : 'Campo obrigatório'),
        ],
      });
      const hotels = await Hotel.findAll({
        where: {
          address: {
            [Op.like]: `%${destination}%`,
          },
        },
        include: [
          {
            model: Room,
            where: {
              disponibility: true,
              id: {
                [Op.notIn]: [
                  Sequelize.literal(`
                    SELECT "roomId" 
                    FROM "Reserves" 
                    WHERE "entryDate" < '${checkout}' 
                    AND "departureDate" > '${checkin}'
                  `),
                ],
              },
            },
          },
        ],
      });

    const toReturn = [];

    for (const hotel of hotels) {
      const hotelRooms = await Room.findAll({ where: { hotelId: hotel.id } });

      for (const room of hotelRooms) {
        const roomImages = await Image.findAll({
          where: { referenceId: room.id },
        });

        toReturn.push({
          ...room.dataValues,
          images: roomImages.map(i => i.imagePath),
        });
      }
    }

    return response(res, { status: 200, data: toReturn });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const indexAll: RequestHandler = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    const hotelProcessed: IdToHotel = {};
    const toReturn: (Room & { images: string[] })[] = [];
    for (const room of rooms) {
      if(!hotelProcessed[room.hotelId]) {
        const hotel = await Hotel.findOne({where: {id: room.hotelId}});
        hotelProcessed[room.hotelId] = hotel!;
      }
      const roomImages = await Image.findAll({
        where: { referenceId: room.id },
      });

      toReturn.push({
        ...room.dataValues,
        images: roomImages.map(i => i.imagePath),
        address: hotelProcessed[room.hotelId].address
      } as Room & {
        images: string[];
        address: string;
      });
    }

    return response(res, { status: 200, data: toReturn });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const update: RequestHandler = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const room = await Room.findByPk(req.body.id);
    if (!room) throw new Error('Room not found');
    if (room.hotelId !== hotelId)
      throw new Error('Room does not belong to this hotel');
    room.update(req.body);
    await room.save();
    return response(res, { status: 200, data: room });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const avaible: RequestHandler = async (req, res) => {
  try {
    const rooms = await Room.findAll({ where: { disponibility: true } });
    return response(res, { status: 200, data: rooms });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const destroy: RequestHandler = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const room = await Room.findByPk(req.body.id);
    if (!room) throw new Error('Room not found');
    if (room.hotelId !== hotelId)
      throw new Error('Room does not belong to this hotel');
    await room.destroy();
    return response(res, { status: 200, data: room });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const getById: RequestHandler = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ where: { id: roomId } });
    if (!room) throw new Error('Room not found');
    const roomImages = await Image.findAll({
      where: { referenceId: room.id },
    });

    return response(res, {
      status: 200,
      data: {
        ...room.dataValues,
        images: roomImages.map(i => i.imagePath),
      },
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export {
  store,
  index,
  indexAll,
  update,
  avaible,
  destroy,
  getById,
  indexByParams,
};
