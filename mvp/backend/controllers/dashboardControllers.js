const User = require("../models/User");
const Organization = require("../models/Organization");
const Product=require('../models/Product');


function serializeProduct(p, defaultThreshold) {
  const effective = p.lowStockThreshold ?? defaultThreshold;
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    quantityOnHand: p.quantityOnHand,
    costPrice: p.costPrice === null ? null : Number(p.costPrice),
    sellingPrice: p.sellingPrice === null ? null : Number(p.sellingPrice),
    lowStockThreshold: p.lowStockThreshold,
    effectiveThreshold: effective,
    isLow: p.quantityOnHand <= effective,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
const getDashboard = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.orgId);

    if (!org) {
      return res.status(404).json({
        errors: ["Organization not found."],
      });
    }

    const products = await Product.findAll({
      where: { OrganizationId: req.orgId },
    });

    const all = products.map((p) =>
      serializeProduct(p, org.defaultLowStockThreshold)
    );

    const lowStock = all
      .filter((p) => p.isLow)
      .sort(
        (a, b) =>
          a.quantityOnHand - b.quantityOnHand ||
          a.name.localeCompare(b.name)
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantityOnHand: p.quantityOnHand,
        threshold: p.effectiveThreshold,
      }));
    const totalUnits=all.reduce((sum, p) => sum + p.quantityOnHand, 0);
    return res.status(200).json({
      totalProducts: all.length,
      totalUnits,
      lowStock,
      all,
      products
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

module.exports = { getDashboard };