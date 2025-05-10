const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const JSON_SERVER_URL =
  "https://easyfindwork-jsonserver-production.up.railway.app";

// Endpoint tìm kiếm công việc
app.post("/api/chatbot/search-jobs", async (req, res) => {
  const { keyword, userId } = req.body;
  if (!keyword) {
    return res
      .status(400)
      .json({ type: "text", message: "Vui lòng nhập từ khóa tìm kiếm!" });
  }

  const keywords = keyword.toLowerCase().split(" ");

  try {
    // Gọi dữ liệu từ JSON Server
    const [jobsRes, usersRes, companiesRes] = await Promise.all([
      axios.get(`${JSON_SERVER_URL}/jobs`),
      axios.get(`${JSON_SERVER_URL}/users`),
      axios.get(`${JSON_SERVER_URL}/companies`),
    ]);

    const jobs = jobsRes.data;
    const users = usersRes.data;
    const companies = companiesRes.data;

    // Nếu có userId, kiểm tra desiredJob
    if (userId && userId !== "guest") {
      const user = users.find((u) => u.id === userId);
      if (
        user &&
        user.desiredJob &&
        keywords.some((kw) => user.desiredJob.toLowerCase().includes(kw))
      ) {
        const matchedJobs = jobs.filter(
          (job) =>
            job.isActive &&
            (job.title.toLowerCase().includes(user.desiredJob.toLowerCase()) ||
              job.industry
                .toLowerCase()
                .includes(user.desiredJob.toLowerCase()) ||
              job.location
                .toLowerCase()
                .includes(user.desiredJob.toLowerCase()))
        );
        if (matchedJobs.length > 0) {
          const jobData = matchedJobs.slice(0, 3).map((job) => {
            const company = companies.find((c) => c.id === job.companyId);
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
    const matchedJobs = jobs.filter(
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
        const company = companies.find((c) => c.id === job.companyId);
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
  } catch (error) {
    console.error("Lỗi gọi JSON Server:", error.message);
    return res.status(500).json({ type: "text", message: "Lỗi máy chủ!" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
