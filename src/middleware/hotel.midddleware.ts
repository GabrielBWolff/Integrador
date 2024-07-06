import { RequestHandler } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import { errorResponse } from "../utils/response.js";

configDotenv();
const SECRET = process.env.SECRET_HOTEL as string;

const HotelLoginMidddleware: RequestHandler = async (req, res, next) => {
  try {
    const token: string | undefined = req.headers.authorization;
    if (!token) return errorResponse(res, { message: 'Token not provided' });
    const { id } = jwt.verify(token, SECRET) as JwtPayload;
    req.body.hotelId = id as string;
    next();
  } catch (error) {
    return errorResponse(res, error);
  }
};

export { HotelLoginMidddleware };