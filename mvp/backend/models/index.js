//This file defines the relationships between models.

const sequelize = require("../config/database");

const User = require("./User");
const Organization = require("./Organization");
const Product = require("./Product");

Organization.hasMany(User, {
  foreignKey: {
    name: "OrganizationId",
    allowNull: false
  },
  onDelete: "CASCADE"
});

User.belongsTo(Organization, {
  foreignKey: {
    name: "OrganizationId",
    allowNull: false
  }
});

Organization.hasMany(Product, {
  foreignKey: {
    name: "OrganizationId",
    allowNull: false
  },
  onDelete: "CASCADE"
});

Product.belongsTo(Organization, {
  foreignKey: {
    name: "OrganizationId",
    allowNull: false
  }
});

User.hasMany(Product, {
  foreignKey: "lastUpdatedBy",
  onDelete: "SET NULL"
});

Product.belongsTo(User, {
  foreignKey: "lastUpdatedBy",
  as: "lastUpdater"
});

module.exports = {
  sequelize,
  User,
  Organization,
  Product
};