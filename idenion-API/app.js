require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./db/connect.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: "https://xyz.onrender.com",
      credentials: true,
    })
  );
}

app.use(cookieParser());

// created middleware
const { authorizationMiddleware } = require("./middlewares");

// router declares
const authRouter = require("./routers/auth.js");
const userRouter = require("./routers/user.js");
const ideaRouter = require("./routers/idea.js");
const commentRouter = require("./routers/comment.js");

// test route
app.get("/", (req,res) => {
  res.send("This is the Idenion API.")
})

// routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authorizationMiddleware, userRouter);
app.use("/api/v1/idea", authorizationMiddleware, ideaRouter);
app.use("/api/v1/comment", authorizationMiddleware, commentRouter);
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
