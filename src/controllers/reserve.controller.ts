import { RequestHandler } from 'express';
import { errorResponse, response } from '../utils/response.js';
import { Reserve } from '../models/Reserve.js';
import Room from '../models/Room.js';

const reserveRoom: RequestHandler = async (req, res) => {
  try {
    const {
      userId,
      roomId,
      checkin: entryDate,
      checkout: departureDate,
    } = req.body;
    const room = await Room.findByPk(roomId);
    if (!room) throw new Error('Quarto não existe.');
    if (!room.disponibility) throw new Error('Quarto não disponível.');
    const reserve = new Reserve({
      userId,
      roomId,
      entryDate,
      departureDate,
      roomNumber: room.roomNumber,
    });
    room.update({ disponibility: false });
    await reserve.save();
    return response(res, { status: 201, data: reserve });
  } catch (error) {
    console.log(error);
    return errorResponse(res, error);
  }
};

const indexReserves: RequestHandler = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const rooms = await Room.findAll({ where: { hotelId } });
    const reserves = await Reserve.findAll({
      where: { roomId: rooms.map(room => room.id) },
    });

    return response(res, { status: 200, data: reserves });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const indexReservesUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    const reserves = await Reserve.findAll({ where: { userId } });
    return response(res, { status: 200, data: reserves });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const roomsUpdateDisponibility: RequestHandler = async (req, res) => {
  try {
    const reserves = await Reserve.findAll();
    const toUpdateRoom = [];
    const toUpdateReserves = [];

    for (const reserve of reserves) {
      if (reserve.status === 'updated') continue;
      if (new Date() > reserve.departureDate) {
        const room = await Room.findByPk(reserve.roomId);
        if (!room) continue;
        reserve.update({ status: 'updated' });
        room.update({ disponibility: true });

        await reserve.save();
        await room.save();

        toUpdateRoom.push(room);
        toUpdateReserves.push(reserve);
      }
    }

    return response(res, {
      status: 200,
      data: { toUpdateRoom, toUpdateReserves },
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const changeReserveStatus: RequestHandler = async (req, res) => {
  try {
    const { status, hotelId, reserveId } = req.body;
    const reserve = await Reserve.findByPk(reserveId);
    if (!reserve) throw new Error('Reserva não encontrada.');

    const room = await Room.findByPk(reserve.roomId);
    if (!room) throw new Error('Quarto não encontrado.');

    if (room.hotelId !== hotelId)
      throw new Error('Este quarto não pertence a este hotel.');

    if(status === "checkedout" || status === "cancelled") await room.update({ disponibility: true});

    await reserve.update({ status });

    await reserve.save();
    await room.save();
    return response(res, { status: 200, data: reserve });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export {
  reserveRoom,
  roomsUpdateDisponibility,
  changeReserveStatus,
  indexReserves,
  indexReservesUser,
};
