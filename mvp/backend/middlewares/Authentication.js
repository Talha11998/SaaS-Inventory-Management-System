const jwt=require('jsonwebtoken');
const auth = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        errors: ["Not authenticated. Please log in."],
      });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        errors: ["Not authenticated. Please log in."],
      });
    }

    // 3. Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Validate required payload fields
    if (!payload.userId || !payload.orgId) {
      return res.status(401).json({
        errors: ["Invalid authentication token."],
      });
    }

    // 5. Attach identity to the request
    req.userId = payload.userId;
    req.orgId = payload.orgId;

    // 6. Continue to the next middleware or route
    return next();
  } catch (err) {
    if (
      err.name === "TokenExpiredError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        errors: ["Invalid or expired token. Please log in again."],
      });
    }

    console.error("Authentication error:", err);

    return res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

module.exports={auth};