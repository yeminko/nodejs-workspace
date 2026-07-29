const express = require("express");

const feedRoutes = require("./routes/feed");

const app = express();

app.use("/feed", feedRoutes);

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
