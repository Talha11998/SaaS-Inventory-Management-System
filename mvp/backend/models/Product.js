const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },

    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    quantityOnHand: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    costPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    sellingPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    lowStockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 0,
      },
    },

    lastUpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OrganizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
}
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["OrganizationId", "sku"],
      },
    ],
  },
  {
    timestamps: true
  },
);
//The compound unique index ensures that one organization cannot create duplicate SKUs, while different organizations can use the same SKU.

module.exports = Product;
