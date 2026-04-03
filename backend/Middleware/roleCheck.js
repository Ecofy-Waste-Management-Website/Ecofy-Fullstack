const express = require("express");
const router = express.Router();

const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.auth?.sessionClaims?.metadata?.role || "user";

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = router;