class AuthController {
  login(req, res) {
    // Logic xử lý đăng nhập
    res.send("Login successful");
  }

  register(req, res) {
    // Logic xử lý đăng ký
    res.send("Register successful");
  }
}

module.exports = new AuthController(); // Export một instance của AuthController
