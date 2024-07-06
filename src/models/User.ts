import { DataTypes, Model } from 'sequelize';

import bcript from 'bcrypt';
import database from '../database/index.js';

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare isOwner: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  async login(password: string) {
    if (!this.dataValues.password || !password) return false;
    return await bcript.compare(password, this.dataValues.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: {
          args: [3],
          msg: 'Requerido ao mínimo 3 letras!',
        },

        max: {
          args: [100],
          msg: 'Tamanho máximo de 100 caracteres!',
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email inválido!',
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 60],
          msg: 'Tamanho deve ser entre 8 e 60 caracteres!',
        },
      },
    },

    isOwner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    active: {
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
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    underscored: false,
  }
);

User.addHook('beforeSave', (client: User) => {
  if (!client.changed('password')) return;
  const password = bcript.hashSync(client.password, 10);
  client.password = password;
});

export default User;
