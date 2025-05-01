class SearchController {
  index(req, res) {
    // Logic xử lý tìm kiếm
    res.send("Search results");
  }
}

module.exports = new SearchController(); // Export một instance của SearchController
