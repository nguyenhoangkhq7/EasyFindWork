"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

// Main CompanyDetail Component
const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]); // State để lưu danh sách công việc của công ty
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("companyDetails"); // Quản lý tab đang hoạt động

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        // Fetch company details
        const companyResponse = await axios.get(
          `http://localhost:3000/companies/${id}`
        );
        setCompany(companyResponse.data);

        // Fetch jobs of the company
        const jobsResponse = await axios.get(
          `http://localhost:3000/jobs?companyId=${id}`
        );
        setJobs(jobsResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin công ty");
        setLoading(false);
        console.error(err);
      }
    };

    fetchCompanyDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">
          {error || "Không tìm thấy thông tin công ty"}
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-6 bg-gray-50"
      >
        {/* Header Section */}
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
                    {company.name}
                  </h1>
                  <p className="text-lg text-gray-600">{company.industry}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-500 text-sm">
                    Ngày cập nhật: {formatDate(new Date().toISOString())}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <span className="text-gray-700">
                    Địa chỉ: {company.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-violet-500 mr-2" />
                  <span className="text-gray-700">Quy mô: {company.size}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  <span className="text-gray-700">
                    Thành lập: {formatDate(company.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Company Details */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-2/3"
          >
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("companyDetails")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "companyDetails"
                      ? "text-violet-600 border-b-2 border-violet-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Thông tin công ty
                </button>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === "jobs"
                      ? "text-violet-600 border-b-2 border-violet-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Công việc đang tuyển ({jobs.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "companyDetails" && (
              <>
                {/* Company Information */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Thông tin chung
                  </h2>
                  <div className="bg-violet-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                  <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Giới thiệu công ty
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{company.description}</p>
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === "jobs" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Công việc đang tuyển
                </h2>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <motion.div
                        key={job.id}
                        whileHover={{ scale: 1.02 }}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <Link
                          to={`/job/${job.id}`}
                          className="block hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <h3 className="font-medium text-violet-600">
                            {job.title}
                          </h3>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-500">
                              {job.location}
                            </span>
                            <span className="text-green-600">
                              {formatCurrency(job.salaryMin)} -{" "}
                              {formatCurrency(job.salaryMax)} triệu
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Hạn nộp: {formatDate(job.deadline)}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Hiện tại công ty không có công việc nào đang tuyển.
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Quick Info (only shown when Company Details tab is active) */}
          {activeTab === "companyDetails" && (
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
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Thống kê
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaBuilding className="text-violet-500 mr-2" />
                    <p className="text-gray-700">
                      Số công việc đang tuyển: {jobs.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDetail;
