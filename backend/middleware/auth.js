// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const { admin } = require("../config/firebase");

// 1. Basic Token Verification (Are they logged in?)
// Example Middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if the header exists and is formatted correctly
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    // 2. Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // 3. Attach the user payload to the request
    req.user = decodedToken;
    next();
  } catch (error) {
    // 4. Log the actual error for your own debugging
    console.error("Firebase Token Verification Error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// 2. Strict Super Admin Check (For registering new users)
const requireSuperAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.role === "super_admin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Forbidden: Only Super Admins can perform this action." });
};

// 3. Dynamic Type Check (Matches route params like /api/applications/:type)
const requireDynamicTypeAccess = (req, res, next) => {
  const requiredType = req.params.type; // Will be 'dinner' or 'merch'
  const user = req.user;

  // Super Admins bypass the type check
  if (user.role === "super_admin") return next();

  console.log(user);

  // Regular Admins must have a type that matches the route
  if (
    user.role === "admin" &&
    (user.type === requiredType || user.type === "all")
  ) {
    return next();
  }

  return res.status(403).json({
    error: `Forbidden: You do not have permission to manage ${requiredType} applications.`,
  });
};

module.exports = { verifyToken, requireSuperAdmin, requireDynamicTypeAccess };
