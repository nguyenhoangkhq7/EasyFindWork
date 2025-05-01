class JobController {
  detail(req, res) {
    const jobId = req.params.id; // Lấy ID công việc từ URL
    // Logic xử lý lấy chi tiết công việc
    res.send(`Job detail for job ID: ${jobId}`);
  }
}

module.exports = new JobController(); // Export một instance của JobController
