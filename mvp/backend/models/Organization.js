const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Organization = sequelize.define("Organization", {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    required:true,
  },

  defaultLowStockThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 0
    }
  }
});

module.exports = Organization;