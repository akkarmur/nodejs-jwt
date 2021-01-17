require("dotenv/config")
const express = require("express"),
    server = express(),
    logger = require("morgan"),
    cookieParser = require("cookie-parser");

server.use(logger("dev"));
//body parser
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());


server.use("/", require("./routes/user_management"));

server.listen(3000, () => {
    console.log("server is running....");
});

