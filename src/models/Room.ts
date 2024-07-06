// models/Room.js
import { randomUUID } from 'crypto';
import { DataTypes, Model } from 'sequelize';
import database from '../database/index.js';
import Hotel from './Hotel.js';

type RoomFeatures = {
  beds: number;
  shower: boolean;
  bathroom: boolean;
  airConditioning: boolean;
  minibar: boolean;
  safeBox: boolean;
  view: string;
  tv: boolean;
  wifi: boolean;
  workDesk: boolean;
  hairDryer: boolean;
  others: string[];
};

class Room extends Model {
  declare id: string;
  declare roomNumber: number;
  declare features: object;
  declare description: string;
  declare maxCapacity: number;
  declare hotelId: string;
  declare disponibility: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare pricePerDay: number;

  static async findByHotelId(hotelId: string) {
    return await this.findAll({ where: { hotelId } });
  }

  static setDefaultFeatures(features: RoomFeatures) {
    const defaultFeatures = {
      beds: 1,
      shower: true,
      bathroom: true,
      airConditioning: false,
      minibar: false,
      safeBox: false,
      view: 'no view',
      tv: false,
      wifi: false,
      workDesk: false,
      hairDryer: false,
      others: [],
    };

    return { ...defaultFeatures, ...features };
  }
}

Room.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => randomUUID(),
      primaryKey: true,
    },
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        async isUniqueRoomNumber(value: number) {
          const room = await Room.findOne({
            where: {
              roomNumber: value,
              hotelId: this.hotelId,
            },
          });

          if (room) {
            throw new Error('Room number must be unique within the hotel.');
          }
        },
      },
    },
    pricePerDay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      set(value: RoomFeatures) {
        console.log(value);
        this.setDataValue('features', Room.setDefaultFeatures(value));
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hotelId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'hotels',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    disponibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: database,
    modelName: 'Room',
    tableName: 'Rooms',
    timestamps: true,
    underscored: false,
  }
);

Hotel.hasMany(Room, { foreignKey: 'hotelId' });
Room.belongsTo(Hotel, { foreignKey: 'hotelId' });

export default Room;
