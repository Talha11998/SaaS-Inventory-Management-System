const Product = require("../models/Product");
const Organization = require("../models/Organization");
const {Op}=require('sequelize');

const productsList = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.orgId);

    if (!org) {
      return res.status(404).json({
        errors: ["Organization not found."],
      });
    }

    const q = String(req.query.q ?? "").trim();

    const where = {
      OrganizationId: req.orgId,
    };

    if (q) {
      const like = `%${q.replace(/[\\%_]/g, (c) => "\\" + c)}%`;

      where[Op.or] = [
        { name: { [Op.like]: like } },
        { sku: { [Op.like]: like } },
      ];
    }

    const products = await Product.findAll({
      where,
      order: [["name", "ASC"]],
    });

    return res.json({
      products: products.map((p) =>
        serializeProduct(p, org.defaultLowStockThreshold),
      ),
    });
  } catch (err) {
    console.error("Error fetching products:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

function optNumber(raw, { integer = false } = {}) {
  if (raw === undefined || raw === null || String(raw).trim() === '') return { value: null };
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || (integer && !Number.isInteger(n))) return { error: true };
  return { value: n };
}

function validateProduct(body) {
  const errors = [];
  const name = String(body.name ?? "").trim();
  const sku = String(body.sku ?? "").trim();
  if (!name) errors.push("Name is required.");
  if (!sku) errors.push("SKU is required.");
  const qty = optNumber(
    body.quantityOnHand === "" || body.quantityOnHand == null ? 0 : body.quantityOnHand,
    { integer: true },
  );
  if (qty.error) errors.push("Quantity must be a whole number, 0 or more.");
  const cost = optNumber(body.costPrice);
  if (cost.error) errors.push("Cost price must be a number, 0 or more.");
  const sell = optNumber(body.sellingPrice);
  if (sell.error) errors.push("Selling price must be a number, 0 or more.");
  const thr = optNumber(body.lowStockThreshold, { integer: true });
  if (thr.error)
    errors.push("Low stock threshold must be a whole number, 0 or more.");
  const description = String(body.description ?? "").trim() || null;
  return {
    errors,
    data: {
      name,
      sku,
      description,
      quantityOnHand: qty.value ?? 0,
      costPrice: cost.value,
      sellingPrice: sell.value,
      lowStockThreshold: thr.value,
    },
  };
}

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

const createProduct = async (req, res) => {
  try {
    const { errors, data } = validateProduct(req.body);
    const body=req.body;
    if (
      !errors.length &&
      (await Product.findOne({
        where: {
          OrganizationId: req.orgId,
          sku: data.sku,
        },
      }))
    ) {
      errors.push("A product with that SKU already exists.");
    }

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const org = await Organization.findByPk(req.orgId);

    const product = await Product.create({
      ...data,
      OrganizationId: req.orgId,
      lastUpdatedBy: req.userId,
    });

    return res.status(201).json({
      product: serializeProduct(product, org.defaultLowStockThreshold),body,data
    });
  } catch (err) {
    console.error("Error creating product:", err);

    return res.status(500).json({
      message: "Internal server error while creating product.",
    });
  }
};

async function findOwned(req) {
  return Product.findOne({
    where: { id: req.params.id, OrganizationId: req.orgId },
  });
}

const getProduct = async (req, res) => {
  try {
    const product = await findOwned(req);

    if (!product) {
      return res.status(404).json({
        errors: ["Product not found."],
      });
    }

    const org = await Organization.findByPk(req.orgId);

    if (!org) {
      return res.status(404).json({
        errors: ["Organization not found."],
      });
    }

    return res.status(200).json({
      product: serializeProduct(product, org.defaultLowStockThreshold),
    });
  } catch (err) {
    console.error("Error fetching product:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await findOwned(req);

    if (!product) {
      return res.status(404).json({
        errors: ["Product not found."],
      });
    }

    const { errors, data } = validateProduct(req.body);

    // if (
    //   !errors.length &&
    //   (await Product.findOne({
    //     where: {
    //       OrganizationId: req.orgId,
    //       sku: data.sku,
    //       id: { [Op.ne]: product.id },
    //     },
    //   }))
    // ) {
    //   errors.push("A product with that SKU already exists.");
    // }

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const org = await Organization.findByPk(req.orgId);

    await product.update({
      ...data,
      lastUpdatedBy: req.userId,
    });

    return res.status(200).json({
      product: serializeProduct(product, org.defaultLowStockThreshold),
    });
  } catch (err) {
    console.error("Error updating product:", err);

    return res.status(500).json({
      errors: ["Internal server error while updating product."],
    });
  }
};

const adjustProductStock = async (req, res) => {
  try {
    const product = await findOwned(req);

    if (!product) {
      return res.status(404).json({
        errors: ["Product not found."],
      });
    }

    const delta = Number(req.body.delta);

    if (!Number.isInteger(delta) || delta === 0) {
      return res.status(400).json({
        errors: ["Enter a non-zero whole number (e.g. 5 or -3)."],
      });
    }

    const newQty = product.quantityOnHand + delta;

    if (newQty < 0) {
      return res.status(400).json({
        errors: [
          `Cannot remove ${-delta} units; only ${product.quantityOnHand} on hand.`,
        ],
      });
    }

    const org = await Organization.findByPk(req.orgId);

    if (!org) {
      return res.status(404).json({
        errors: ["Organization not found."],
      });
    }

    await product.update({
      quantityOnHand: newQty,
      lastUpdatedBy: req.userId,
    });

    return res.status(200).json({
      product: serializeProduct(product, org.defaultLowStockThreshold),
    });
  } catch (err) {
    console.error("Error adjusting product quantity:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await findOwned(req);

    if (!product) {
      return res.status(404).json({
        errors: ["Product not found."],
      });
    }

    await product.destroy();

    return res.status(200).json({
      ok: true,
    });
  } catch (err) {
    console.error("Error deleting product:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

module.exports = {
  productsList,
  createProduct,
  getProduct,
  updateProduct,
  adjustProductStock,
  deleteProduct,
};
