//Each organization has one user in this MVP.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id:{
   type:DataTypes.INTEGER,
   primaryKey:true,
   autoIncrement:true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required:true
  },

  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },

  organizationName:{
    type: DataTypes.STRING,
    allowNull: false
  },
  OrganizationId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'Organizations',
    key: 'id',
  },
},
});

module.exports = User;