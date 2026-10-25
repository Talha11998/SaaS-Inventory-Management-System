const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize=require('../config/database');
const Organization = require("../models/Organization");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_SECRET = process.env.JWT_SECRET;
function sign(user) {
  return jwt.sign({ userId: user.id, orgId: user.OrganizationId }, JWT_SECRET, { expiresIn: '8h' });
}

const signup = async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const confirm = String(req.body.confirmPassword ?? "");
    const orgName = String(req.body.organizationName ?? "").trim();
    console.log(">>>>",req.body.organizationName);
    // Validate input
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({
        msg: "Enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters",
      });
    }
    
    if (password !== confirm){
      return res.status(400).json({
        msg: "Passwords do not match.",
      });
    } 

    if (!orgName) {
      return res.status(400).json({
        msg: "Organization name is required.",
      });
    }
    

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create organization and user in one transaction
    const user = await sequelize.transaction(async (t) => {
      const org = await Organization.create(
        { name: orgName },
        { transaction: t }
      );

      return User.create(
        {
          email,
          passwordHash,
          organizationName: orgName,
          OrganizationId: org.id,
        },
        { transaction: t }
      );
    });

    // Respond with token and user information
    return res.status(201).json({
      token: sign(user),
      user: {
        email: user.email,
        organizationName: orgName,
      },
    });
  } catch (err) {
    console.error(err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        msg: "Email already exists.",
      });
    }

    return res.status(500).json({
      msg: "Something went wrong during signup.",
    });
  }
};


const login = async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        errors: ["Email and password are required."],
      });
    }

    // 2. Find user and associated organization
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Organization,
          as:'Organization',
          attributes: ["id", "name"],
        },
      ],
    });

    // 3. Verify credentials
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        errors: ["Invalid email or password."],
      });
    }

    // 4. Generate token and return user data
    const token = sign(user);
    console.log('Token generated:', token);
    console.log('OrganizationId:', user.OrganizationId);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        organizationName: user.Organization?.name ?? null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      errors: ["An internal server error occurred."],
    });
  }
};

module.exports = {signup,login};