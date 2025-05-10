"use client";

import { useState, useEffect } from "react";
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
import ApplyJobModal from "./ApplyJobModal";
import { useSelector, useDispatch } from "react-redux";
import { getJobById } from "../service/job";
import Swal from "sweetalert2";

// Main JobDetail Component
const JobDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
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

        // Fetch job using getJobById from service
        const jobData = await getJobById(id);
        if (!jobData) {
          throw new Error("Job not found");
        }
        setJob(jobData);

        // Fetch company data
        const companyResponse = await axios.get(
          `https://easyfindwork-jsonserver-production.up.railway.app/companies/${jobData.companyId}`
        );
        setCompany(companyResponse.data);

        // Check if job is saved, only if user is logged in
        if (user?.id) {
          const savedJobsResponse = await axios.get(
            `https://easyfindwork-jsonserver-production.up.railway.app/savedJobs?userId=${user.id}&jobId=${id}`
          );
          setIsSaved(savedJobsResponse.data.length > 0);
        }

        // Fetch similar jobs
        const allJobsResponse = await axios.get(
          `https://easyfindwork-jsonserver-production.up.railway.app/jobs`
        );
        const allJobs = allJobsResponse.data;

        const similar = allJobs
          .filter((j) => j.id !== id)
          .filter((j) => j.industry === jobData.industry)
          .filter((j) => j.location === jobData.location)
          .filter(
            (j) =>
              (j.salaryMin >= jobData.salaryMin * 0.8 &&
                j.salaryMin <= jobData.salaryMax * 1.2) ||
              (j.salaryMax >= jobData.salaryMin * 0.8 &&
                j.salaryMax <= jobData.salaryMax * 1.2)
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
  }, [id, user?.id]);

  const promptLogin = (actionText) => {
    Swal.fire({
      title: "Yêu cầu đăng nhập",
      text: `Bạn cần đăng nhập để ${actionText}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: "OPEN_LOGIN_MODAL" });
      }
    });
  };

  const handleApply = () => {
    if (!user?.id) {
      promptLogin("nộp hồ sơ");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSaveJob = async () => {
    if (!user?.id) {
      promptLogin("lưu công việc");
      return;
    }

    try {
      if (isSaved) {
        const savedJobsResponse = await axios.get(
          `https://easyfindwork-jsonserver-production.up.railway.app/savedJobs?userId=${user.id}&jobId=${id}`
        );
        const savedJob = savedJobsResponse.data[0];

        if (savedJob) {
          await axios.delete(
            `https://easyfindwork-jsonserver-production.up.railway.app/savedJobs/${savedJob.id}`
          );
          setIsSaved(false);
        } else {
          console.warn("Không tìm thấy savedJob để xóa");
          setIsSaved(false);
        }
      } else {
        await axios.post(
          "https://easyfindwork-jsonserver-production.up.railway.app/savedJobs",
          {
            id: `savedJob_${Date.now()}`,
            userId: user.id,
            jobId: id,
            savedAt: new Date().toISOString(),
          }
        );
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Lỗi khi lưu/bỏ lưu công việc:", err);
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi lưu/bỏ lưu công việc",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
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
    return new Intl.NumberFormat("vi-VN").format(amount / 1000000);
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
                  whileHover={{ scale: user?.id ? 1.05 : 1 }}
                  whileTap={{ scale: user?.id ? 0.95 : 1 }}
                  onClick={handleApply}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-colors shadow-md ${
                    user?.id
                      ? "bg-violet-400 hover:bg-violet-500"
                      : "bg-violet-300 opacity-50 cursor-not-allowed"
                  }`}
                >
                  Nộp hồ sơ
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveJob}
                  className={`px-6 py-2 rounded-lg font-medium border transition-colors ${
                    isSaved
                      ? "bg-yellow-200 text-yellow-800 border-yellow-300 hover:bg-yellow-300"
                      : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
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
                          <p className="font-medium">
                            {job.level || "Chuyên viên nhân viên"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaVenusMars className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Yêu cầu giới tính</p>
                          <p className="font-medium">
                            {job.sex || "Không yêu cầu"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaClock className="text-violet-500 mt-1 mr-3" />
                        <div>
                          <p className="text-gray-500">Hình thức làm việc</p>
                          <p className="font-medium">
                            {job.workType || "Toàn thời gian cố định"}
                          </p>
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
                            {job.experience || "Ưu tiên có kinh nghiệm"}
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
