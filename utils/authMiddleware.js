const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: "Access denied" }));
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    await next();
  } catch (error) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: "Invalid token" }));
  }
}

module.exports = { authenticateToken };
