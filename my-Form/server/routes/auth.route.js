const Router = require("express").Router();
const { signup, login } = require("../controllers/auth.controller");

Router.post("/signup", signup);
Router.post("/login", login);

module.exports = Router;
