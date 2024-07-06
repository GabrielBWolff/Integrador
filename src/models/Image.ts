// models/Image.js
import { randomUUID } from 'crypto';
import { DataTypes, Model } from 'sequelize';
import database from '../database/index.js';
import Hotel from './Hotel.js';
import Room from './Room.js';

class Image extends Model {
  declare id: string;
  declare referenceId: string;
  declare imagePath: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Image.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => randomUUID(),
      primaryKey: true,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Image',
    tableName: 'Images',
    timestamps: true,
    underscored: false,
  }
);

Image.belongsTo(Hotel, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: { referenceType: 'Hotel' },
});
Hotel.hasMany(Image, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: { referenceType: 'Hotel' },
});

Image.belongsTo(Room, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: { referenceType: 'room' },
});
Room.hasMany(Image, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: { referenceType: 'room' },
});

export default Image;
