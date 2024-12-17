const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const AuthController = {
  registerUser: async (req, res) => {
    const { userFirstName, userLastName, password, emailAdd, phoneNum, roles } =
      req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.createUser(
        userFirstName,
        userLastName,
        hashedPassword,
        emailAdd,
        phoneNum,
        roles,
      );

      if (!res.headersSent) {
        res.statusCode = 201;
        return res.end(
          JSON.stringify({
            message: "User registered successfully",
            userId: newUser.id,
          }),
        );
      }
    } catch (error) {
      if (!res.headersSent) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: error.message }));
      }
    }
  },

  loginUser: async (req, res) => {
    const { emailAdd, password } = req.body;
    try {
      const user = await UserModel.getUserByUsername(emailAdd);

      if (!user) {
        if (!res.headersSent) {
          res.statusCode = 401;
          return res.end(
            JSON.stringify({ error: "Invalid username or password" }),
          );
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        if (!res.headersSent) {
          res.statusCode = 401;
          return res.end(
            JSON.stringify({ error: "Invalid username or password" }),
          );
        }
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
        expiresIn: "1h",
      });

      if (!res.headersSent) {
        res.statusCode = 200;
        return res.end(JSON.stringify({ message: "Login successful", token }));
      }
    } catch (error) {
      if (!res.headersSent) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
  },
};

module.exports = AuthController;
