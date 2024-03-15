const express = require("express");
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./middlewares/error");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.use(errorHandler);

try {
  app.listen(process.env.PORT, () => console.log(`Listening to port ${process.env.PORT}`));
} catch (error) {
  console.log(error);
}
