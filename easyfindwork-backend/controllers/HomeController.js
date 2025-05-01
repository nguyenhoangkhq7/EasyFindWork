class HomeController {
  index(req, res) {
    return res.send("Home page"); // Send a response to the client
  }
}

module.exports = new HomeController(); // Export an instance of the HomeController class
