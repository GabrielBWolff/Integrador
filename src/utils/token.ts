import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";

configDotenv();

const createToken = (id: string, SECRET: string) => {
  const token = jwt.sign({ id }, SECRET, {
    expiresIn: '1hr'
  });
  return token;
};


export { createToken }