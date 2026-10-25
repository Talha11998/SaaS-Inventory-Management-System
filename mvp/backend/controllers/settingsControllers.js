const Organization = require('../models/Organization');


const getSettings = async (req, res) => {
  try {
    const org = await Organization.findByPk(req.orgId);

    if (!org) {
      return res.status(404).json({
        errors: ["Organization not found."],
      });
    }

    return res.status(200).json({
      defaultLowStockThreshold: org.defaultLowStockThreshold,
    });
  } catch (err) {
    console.error("Error fetching settings:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const raw = req.body.defaultLowStockThreshold;
    const n = Number(raw);

    // Validate threshold
    if (
      raw === "" ||
      raw === null ||
      raw === undefined ||
      !Number.isInteger(n) ||
      n < 0
    ) {
      return res.status(400).json({
        errors: ["Threshold must be a whole number, 0 or more."],
      });
    }

    // Find organization
    const org = await Organization.findByPk(req.orgId);

    if (!org) {
      return res.status(404).json({
        errors: ["Organization not found."],
      });
    }

    // Update settings
    await org.update({
      defaultLowStockThreshold: n,
    });

    return res.status(200).json({
      defaultLowStockThreshold: n,
    });
  } catch (err) {
    console.error("Error updating settings:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

module.exports = { getSettings,updateSettings};