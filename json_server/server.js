const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Đọc dữ liệu JSON
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));

// Endpoint tìm kiếm công việc
app.post("/api/chatbot/search-jobs", (req, res) => {
  const { keyword, userId } = req.body;
  if (!keyword) {
    return res
      .status(400)
      .json({ type: "text", message: "Vui lòng nhập từ khóa tìm kiếm!" });
  }

  const keywords = keyword.toLowerCase().split(" ");

  // Nếu có userId, kiểm tra desiredJob
  if (userId && userId !== "guest") {
    const user = data.users.find((u) => u.id === userId);
    if (
      user &&
      user.desiredJob &&
      keywords.some((kw) => user.desiredJob.toLowerCase().includes(kw))
    ) {
      const matchedJobs = data.jobs.filter(
        (job) =>
          job.isActive &&
          (job.title.toLowerCase().includes(user.desiredJob.toLowerCase()) ||
            job.industry
              .toLowerCase()
              .includes(user.desiredJob.toLowerCase()) ||
            job.location.toLowerCase().includes(user.desiredJob.toLowerCase()))
      );
      if (matchedJobs.length > 0) {
        const jobData = matchedJobs.slice(0, 3).map((job) => {
          const company = data.companies.find((c) => c.id === job.companyId);
          return {
            id: job.id,
            title: job.title,
            location: job.location,
            company: company ? company.name : "Không xác định",
            salary: job.salaryMin
              ? `${job.salaryMin.toLocaleString(
                  "vi-VN"
                )} - ${job.salaryMax.toLocaleString("vi-VN")} VND`
              : "Thỏa thuận",
            url: `http://localhost:5173/job/${job.id}`,
          };
        });
        return res.json({ type: "jobs", data: jobData });
      }
    }
  }

  // Tìm công việc chung
  const matchedJobs = data.jobs.filter(
    (job) =>
      job.isActive &&
      keywords.some(
        (kw) =>
          job.title.toLowerCase().includes(kw) ||
          job.location.toLowerCase().includes(kw) ||
          job.industry.toLowerCase().includes(kw)
      )
  );

  if (matchedJobs.length > 0) {
    const jobData = matchedJobs.slice(0, 3).map((job) => {
      const company = data.companies.find((c) => c.id === job.companyId);
      return {
        id: job.id,
        title: job.title,
        location: job.location,
        company: company ? company.name : "Không xác định",
        salary: job.salaryMin
          ? `${job.salaryMin.toLocaleString(
              "vi-VN"
            )} - ${job.salaryMax.toLocaleString("vi-VN")} VND`
          : "Thỏa thuận",
        url: `http://localhost:5173/job/${job.id}`,
      };
    });
    return res.json({ type: "jobs", data: jobData });
  } else {
    return res.json({
      type: "text",
      message:
        'Không tìm thấy công việc phù hợp. Hãy thử từ khóa khác, ví dụ: "IT", "Hà Nội", "Marketing".',
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
