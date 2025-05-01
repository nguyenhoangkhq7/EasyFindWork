class UserController {
  profile(req, res) {
    // Logic xử lý lấy thông tin người dùng
    res.send("User profile data");
  }
}

module.exports = new UserController(); // Export một instance của UserController
