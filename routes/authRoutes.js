const AuthController = require("../controllers/authController");
const { parse } = require("url");

const authRoutes = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const { pathname } = parse(req.url, true);
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    req.body = body ? JSON.parse(body) : {};

    try {
      if (req.method === "POST" && pathname === "/auth/signup") {
        console.log("authRoutes");
        await AuthController.registerUser(req, res);
      } else if (req.method === "POST" && pathname === "/auth/login") {
        await AuthController.loginUser(req, res);
      } else {
        if (!res.headersSent) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Not Found" }));
        }
      }
    } catch (error) {
      console.error("Error processing request:", error);

      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
  });
};

module.exports = authRoutes;
