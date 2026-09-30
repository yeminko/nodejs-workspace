// const fs = require("fs");
// import fs from "fs";

import fs from "fs/promises";

import path from "path";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resHandler = (req, res, next) => {
  // fs.readFile("my-page.html", "utf8", (err, data) => {
  //   res.send(data);
  // });

  // res.sendFile(path.join(__dirname, "my-page.html"));

  fs.readFile(path.join(__dirname, "my-page.html"), "utf8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};

// module.exports = resHandler;
