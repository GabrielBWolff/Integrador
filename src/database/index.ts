import sequelize, { Sequelize } from 'sequelize';
import config from '../config/database.js';

export default new Sequelize({ ...config, logging: true });
