import { Model, DataTypes } from 'sequelize';
import database from '../database/index.js';

class Reserve extends Model {
  public id!: number;
  public userId!: number;
  public roomId!: string;
  public roomNumber!: number;
  public entryDate!: Date;
  public departureDate!: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reserve.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Rooms',
        key: 'id',
      },
    },
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    departureDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    sequelize: database,
    modelName: 'Reserve',
    tableName: 'Reserves',
    timestamps: true,
    underscored: false,
  }
);

export { Reserve };
