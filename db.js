const Sequelize = require('sequelize')
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
      timezone: 'Etc/GMT0'
    }
  }
)
module.exports = db

db.Base = db.define(
  'base',
  {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false
    },
    secret: {
      type: Sequelize.STRING,
      allowNull: false
    },
    public: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
)

db.Data = db.define(
  'data',
  {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false
    },
    base: {
      type: Sequelize.UUID,
      allowNull: false
    },
    record: {
      type: Sequelize.UUID,
      allowNull: false
    },
    key: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    paranoid: true
  }
)
