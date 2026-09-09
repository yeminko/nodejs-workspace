require("dotenv").config();
const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const graphqlHttp = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");
const auth = require("./middleware/is-auth");
const { clearImage } = require("./utils/file");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" },
);

const app = express();
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put(
  "/post-image",
  auth,
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
  (req, res, next) => {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    if (!req.file) {
      return res.status(200).json({ message: "No file provided!" });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res
      .status(201)
      .json({ message: "File stored.", filePath: req.file.path });
  },
);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  }),
);

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(9000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
