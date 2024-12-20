const http = require("http");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");

const server = http.createServer((req, res) => {
  const { pathname } = require("url").parse(req.url, true);

  if (pathname.startsWith("/auth")) {
    authRoutes(req, res);
  } else if (pathname.startsWith("/booking")) {
    bookingRoutes(req, res);
  } else {
    if (!res.headersSent) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  }
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
