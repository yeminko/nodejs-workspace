const express = require("express");
const router = express.Router();

const users = [];

router.get("/", (req, res, next) => {
  res.render("user", { pageTitle: "User Page", users: users });
});

router.post("/", (req, res, next) => {
  users.push(req.body.username);
  res.redirect("/");
});

module.exports = router;
