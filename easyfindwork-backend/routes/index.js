const homeRoute = require("./home");
const searchRoute = require("./search");
const jobRoute = require("./job");
const userRoute = require("./user");
const authRoute = require("./auth");

function route(app) {
  app.use("/search", searchRoute); // Route cho tìm kiếm
  app.use("/job", jobRoute); // Route cho chi tiết công việc
  app.use("/user", userRoute); // Route cho thông tin người dùng
  app.use("/auth", authRoute); // Route cho đăng nhập/đăng ký
  app.use("/", homeRoute); // Route cho trang chủ
}

module.exports = route;
