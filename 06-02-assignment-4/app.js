const express = require("express");
const bodyParser = require("body-parser");

const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/user");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", homeRoutes);
app.use("/users", userRoutes);

app.listen(3000);
