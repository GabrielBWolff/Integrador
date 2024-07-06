/* eslint-disable no-useless-escape */
// models/Room.js
import { Model, DataTypes } from 'sequelize';
import { randomUUID } from 'crypto';
import bcript from 'bcrypt';

import database from '../database/index.js';

type HotelFeatures = {
  hasWiFi: boolean;
  hasParking: boolean;
  hasPool: boolean;
  hasGym: boolean;
  hasRestaurant: boolean;
  hasBar: boolean;
  hasSpa: boolean;
  hasRoomService: boolean;
  hasConferenceRooms: boolean;
  otherFeatures: string[];
};

class Hotel extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare evaluation: number;
  declare address: string;
  declare description: string;
  declare features: HotelFeatures;
  declare phone: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  async login(password: string) {
    if (!this.dataValues.password || !password) return false;
    return await bcript.compare(password, this.dataValues.password);
  }

  static setDefaultFeatures(features: HotelFeatures) {
    const defaultFeatures = {
      hasWiFi: false,
      hasParking: false,
      hasPool: false,
      hasGym: false,
      hasRestaurant: false,
      hasBar: false,
      hasSpa: false,
      hasRoomService: false,
      hasConferenceRooms: false,
      otherFeatures: [],
    };

    return { ...defaultFeatures, ...features };
  }
}

Hotel.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email inválido',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 60],
          msg: 'Senha deve ter entre 8 e 60 caracteres',
        },
        is: {
          args: /^[a-zA-Z0-9!@#\$%\^&*\)\(+=._-]+$/,
          msg: 'Senha inválida',
        },
      },
    },
    evaluation: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      set(value: HotelFeatures) {
        this.setDataValue('features', Hotel.setDefaultFeatures(value));
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: 'Hotel',
    tableName: 'Hotels',
    timestamps: true,
    underscored: false,
  }
);

Hotel.addHook('beforeSave', (client: Hotel) => {
  if (!client.changed('password')) return;
  const password = bcript.hashSync(client.password, 10);
  client.password = password;
});

export default Hotel;
