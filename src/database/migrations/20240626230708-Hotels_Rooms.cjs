/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
'use strict';

const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Hotels", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: randomUUID(),
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Email inválido",
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      evaluation: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      features: {
        type: Sequelize.JSON,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable("Rooms", {
      id: {
        type: Sequelize.STRING,
        defaultValue: randomUUID(),
        primaryKey: true
      },
      pricePerDay: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      roomNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      features: {
        type: Sequelize.JSON,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      maxCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hotelId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Hotels',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      disponibility: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable("Images", {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: randomUUID(),
        primaryKey: true
      },
      referenceId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imagePath: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Images");
    await queryInterface.dropTable("Room");
    await queryInterface.dropTable("Hotel");
  }
};
