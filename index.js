require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const userRouter = require("./src/routes/user");
const productRouter = require("./src/routes/product");

app.use("/img", express.static("./upload"));
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
