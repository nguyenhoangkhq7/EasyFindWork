"use client";

import { useState, useEffect, use } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaVenusMars,
  FaBriefcase,
  FaUserTie,
  FaBuilding,
  FaMoneyBillWave,
  FaUsers,
  FaClock,
} from "react-icons/fa";
import ApplyJobModal from "./ApplyJobModal"; // Nhập component ApplyJobModal
import { useSelector } from "react-redux";

// Main JobDetail Component
const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobDetails");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const jobResponse = await axios.get(`http://localhost:3000/jobs/${id}`);
        setJob(jobResponse.data);

        const companyResponse = await axios.get(
          `http://localhost:3000/companies/${jobResponse.data.companyId}`
        );
        setCompany(companyResponse.data);

        const savedJobsResponse = await axios.get(
          `http://localhost:3000/savedJobs?userId=${user.id}&jobId=${id}`
        );
        setIsSaved(savedJobsResponse.data.length > 0);

        const allJobsResponse = await axios.get(`http://localhost:3000/jobs`);
        const allJobs = allJobsResponse.data;

        const similar = allJobs
          .filter((j) => j.id !== id)
          .filter((j) => j.industry === jobResponse.data.industry)
          .filter((j) => j.location === jobResponse.data.location)
          .filter(
            (j) =>
              (j.salaryMin >= jobResponse.data.salaryMin * 0.8 &&
                j.salaryMin <= jobResponse.data.salaryMax * 1.2) ||
              (j.salaryMax >= jobResponse.data.salaryMin * 0.8 &&
                j.salaryMax <= jobResponse.data.salaryMax * 1.2)
          )
          .slice(0, 3);

        setSimilarJobs(similar);

        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin công việc");
        setLoading(false);
        console.error(err);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleApply = () => {
    setIsModalOpen(true);
  };

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        // Lấy ID của savedJob dựa trên userId và jobId
        const savedJobsResponse = await axios.get(
          `http://localhost:3000/savedJobs?userId=${user.id}&jobId=${id}`
        );
        const savedJob = savedJobsResponse.data[0]; // Lấy bản ghi đầu tiên (nếu có)

        if (savedJob) {
          await axios.delete(`http://localhost:3000/savedJobs/${savedJob.id}`);
          setIsSaved(false);
        } else {
          console.warn("Không tìm thấy savedJob để xóa");
          setIsSaved(false); // Cập nhật trạng thái nếu không tìm thấy
        }
      } else {
        await axios.post("http://localhost:3000/savedJobs", {
          id: `savedJob_${Date.now()}`,
          userId: user.id,
          jobId: id,
          savedAt: new Date().toISOString(),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Lỗi khi lưu/bỏ lưu công việc:", err);
      alert("Có lỗi xảy ra khi lưu/bỏ lưu công việc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600"></div>
      </div>
    );
  }

  if (error || !job || !company) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">
          {error || "Không tìm thấy thông tin công việc"}
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount/1000000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="relative min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`max-w-6xl mx-auto p-6 bg-gray-50 ${
          isModalOpen ? "pointer-events-none" : ""
        }`}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={company.name}
                className="w-24 h-24 object-contain border p-2 rounded-lg shadow-sm"
              />
            </div>
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {job.title}
                  </h1>
                  <Link
                    to={`/company/${company.id}`}
                    className="text-lg text-violet-600 hover:underline"
                  >
                    {company.name}
                  </Link>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-500 text-sm">
                    Ngày cập nhật: {formatDate(new Date().toISOString())}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-green-500 mr-2" />
                  <span className="text-gray-700">
                    Mức lương: {formatCurrency(job.salaryMin)} -{" "}
                    {formatCurrency(job.salaryMax)} triệu
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <span className="text-gray-700">
                    Khu vực tuyển: {job.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <span className="text-gray-700">
                    Hạn nộp hồ sơ: {formatDate(job.deadline)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApply}
                  className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors shadow-md"
                >
                  Nộp hồ sơ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveJob}
                  className={`px-6 py-2 rounded-lg font-medium border transition-colors ${
                    isSaved
                      ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {isSaved ? "Đã lưu" : "Lưu công việc"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-2/3"
          >
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("jobDetails")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "jobDetails"
                      ? "text-violet-600 border-b-2 border-violet-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Chi tiết tuyển dụng
                </button>
                <button
                  onClick={() => setActiveTab("company")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "company"
                      ? "text-violet-600 border-b-2 border-violet-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Công Ty
                </button>
              </div>
            </div>

            {activeTab === "jobDetails" && (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Thông tin chung
                  </h2>
                  <div className="bg-violet-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start">
                        <FaCalendarAlt className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Ngày đăng</p>
                          <p className="font-medium">
                            {formatDate(job.postedDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaUserTie className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Cấp bậc</p>
                          <p className="font-medium">Chuyên viên nhân viên</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaVenusMars className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Yêu cầu giới tính</p>
                          <p className="font-medium">Nữ</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaClock className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Hình thức làm việc</p>
                          <p className="font-medium">Toàn thời gian cố định</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaUsers className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Số lượng tuyển</p>
                          <p className="font-medium">{job.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaBriefcase className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Yêu cầu kinh nghiệm</p>
                          <p className="font-medium">
                            Không yêu cầu kinh nghiệm
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-start">
                      <FaBuilding className="text-violet-500 mt-1 mr-3" />
                      <div>
                        <p className="text-gray-500">Ngành nghề</p>
                        <p className="font-medium">{job.industry}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Mô tả công việc
                  </h2>
                  <div className="prose max-w-none">
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {job.description.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Yêu cầu công việc
                  </h2>
                  <div className="prose max-w-none">
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {job.requirements.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Quyền lợi được hưởng
                  </h2>
                  <div className="prose max-w-none">
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      {job.benefits.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === "company" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {company.name}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaBuilding className="text-violet-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-500">Ngành nghề</p>
                      <p className="font-medium">{company.industry}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-red-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-500">Địa chỉ</p>
                      <p className="font-medium">{company.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaUsers className="text-violet-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-500">Quy mô</p>
                      <p className="font-medium">{company.size}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-500">Ngày thành lập</p>
                      <p className="font-medium">
                        {formatDate(company.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      Giới thiệu công ty
                    </h3>
                    <p className="text-gray-700">{company.description}</p>
                  </div>
                  <Link
                    to={`/company/${company.id}`}
                    className="block text-center mt-4 text-violet-600 hover:underline"
                  >
                    Xem trang công ty →
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>

          {activeTab === "jobDetails" && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-1/3"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {company.name}
                </h2>
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-700">Địa chỉ: {company.address}</p>
                </div>
                <div className="flex items-center mb-4">
                  <FaUsers className="text-violet-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-700">Quy mô: {company.size}</p>
                </div>
                <Link
                  to={`/company/${company.id}`}
                  className="block text-center mt-4 text-violet-600 hover:underline"
                >
                  Xem trang công ty →
                </Link>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Việc làm tương tự
                </h2>
                {similarJobs.length > 0 ? (
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <motion.div
                        key={similarJob.id}
                        whileHover={{ scale: 1.02 }}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <Link
                          to={`/job/${similarJob.id}`}
                          className="block hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <h3 className="font-medium text-violet-600">
                            {similarJob.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {company.name}
                          </p>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-500">
                              {similarJob.location}
                            </span>
                            <span className="text-green-600">
                              {formatCurrency(similarJob.salaryMin)} -{" "}
                              {formatCurrency(similarJob.salaryMax)} triệu
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Không tìm thấy việc làm tương tự.
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={id}
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetail;
