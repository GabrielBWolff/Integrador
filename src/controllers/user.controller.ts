import { RequestHandler } from 'express';
import { errorResponse, response } from '../utils/response.js';
import User from '../models/User.js';
import { configDotenv } from 'dotenv';
import { createToken } from '../utils/token.js';

configDotenv();
const SECRET = process.env.SECRET_USER as string;

const index: RequestHandler = async (req, res) => {
  try {
    const users = await User.findAll();
    return response(res, { status: 200, data: users });
  } catch (error) {
    console.log(error);
    return errorResponse(res, error);
  }
};

const store: RequestHandler = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user.id.toString(), SECRET);
    return response(res, { status: 200, data: token });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Email and password are required');
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) throw new Error('User not found');
    const isValid = await user.login(password);
    if (!isValid) throw new Error('Invalid password');
    const token = createToken(user.id.toString(), SECRET);
    return response(res, { status: 200, data: token });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const put: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    user.update(req.body);
    user.save();
    return response(res, { status: 200, data: user });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export { index, store, login, put };
