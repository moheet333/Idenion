require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./db/connect.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// created middleware
const authorizationMiddleware = require("./middlewares/authorization.js");

// router declares
const authRouter = require("./routers/auth.js");
const userRouter = require("./routers/user.js");

// routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authorizationMiddleware, userRouter);

// start server

const start = () => {
  try {
    db.connect();
    app.listen(PORT, function () {
      console.log(`Server started on port : ${PORT} and Database connected.`);
    });
  } catch (error) {
    console.log("Error starting server! ", error);
  }
};

start();
