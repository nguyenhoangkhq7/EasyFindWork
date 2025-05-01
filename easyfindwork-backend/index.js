const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const route = require("./routes/index");
const mongoose = require("mongoose");

// connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// cấu hình quyền truy cập cho client
app.use(
  cors({
    origin: process.env.CLIENT_URL, // url of the client app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(morgan("combined")); // để xem log request từ client

app.use(express.json()); // đọc json từ body của request
app.use(express.urlencoded({ extended: true })); // đọc dữ liệu từ body của request nhưng không phải là json

// cấu hình các route cho server
route(app);

const PORT = process.env.PORT || 5000; // cổng mà server sẽ lắng nghe

const listener = app.listen(PORT, () => {
  console.log(`Server is running on port ${listener.address().port}`);
});
