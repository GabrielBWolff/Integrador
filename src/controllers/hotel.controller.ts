import { RequestHandler } from 'express';
import { errorResponse, response } from '../utils/response.js';
import Hotel from '../models/Hotel.js';

import { randomUUID } from 'crypto';
import { createToken } from '../utils/token.js';
import { configDotenv } from 'dotenv';
import axios from 'axios';
import { CEP } from '../type/cep.type.js';
import { get } from 'http';

configDotenv();
const SECRET = process.env.SECRET_HOTEL as string;

export async function getCEP(cep: string) {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  if (response.status !== 200) throw new Error('CEP inválido');
  return response.data as CEP;
}

const index: RequestHandler = async (req, res) => {
  try {
    const { hotelId } = req.body;
    console.log(hotelId);
    const hotels = await Hotel.findOne({ where: { id: hotelId } });
    return response(res, { status: 200, data: hotels });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const store: RequestHandler = async (req, res) => {
  try {
    const cepData = await getCEP(req.body.cep);
    req.body.address = `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade}, ${req.body.number} - ${cepData.uf}`;
    console.log(req.body.address);
    const hotel = await Hotel.create({
      id: randomUUID(),
      ...req.body,
    });

    const token = createToken(hotel.id, SECRET);
    return response(res, { status: 201, data: token });
  } catch (error) {
    console.log(error);
    return errorResponse(res, error);
  }
};

const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Email and password are required');
    const hotel = await Hotel.findOne({ where: { email: req.body.email } });
    if (!hotel) throw new Error('Hotel not found');
    const isValid = await hotel.login(password);
    if (!isValid) throw new Error('Invalid password');

    const token = createToken(hotel.id, SECRET);
    return response(res, { status: 200, data: token });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const put: RequestHandler = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) throw new Error('Hotel not found');
    hotel.update(req.body);
    hotel.save();
    return response(res, { status: 200, data: hotel });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export { index, store, login, put };
