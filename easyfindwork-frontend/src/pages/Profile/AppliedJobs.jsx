"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import JobRecomend from "../../components/JobRecomend";
import Swal from "sweetalert2";
import JobItem from "../../components/JobItem";
import JobApplied from "../../components/JobApplied";

const AppliedJobs = () => {
  const user = useSelector((state) => state.user);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user || !user.id) {
        setError("Vui lòng đăng nhập để xem công việc đã ứng tuyển");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách applications của user
        const appliedResponse = await axios.get(
          `https://easyfindwork-jsonserver-production.up.railway.app/applications?userId=${user.id}`
        );
        const appliedJobsData = appliedResponse.data;

        if (!appliedJobsData || appliedJobsData.length === 0) {
          setAppliedJobs([]);
          setLoading(false);
          return;
        }

        // Lấy thông tin chi tiết công việc và công ty
        const jobsWithDetails = await Promise.all(
          appliedJobsData.map(async (appliedJob) => {
            try {
              const jobResponse = await axios.get(
                `https://easyfindwork-jsonserver-production.up.railway.app/jobs/${appliedJob.jobId}`
              );
              const job = jobResponse.data;

              const companyResponse = await axios.get(
                `https://easyfindwork-jsonserver-production.up.railway.app/companies/${job.companyId}`
              );
              const company = companyResponse.data;

              return { job, company };
            } catch (err) {
              console.error(
                `Lỗi khi tải job ${appliedJob.jobId}:`,
                err.message
              );
              return null; // Bỏ qua job lỗi
            }
          })
        );

        // Lọc bỏ các job null (nếu có lỗi)
        const validJobs = jobsWithDetails.filter((item) => item !== null);
        setAppliedJobs(validJobs);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải công việc đã ứng tuyển:", err.message);
        setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user]);

  // Hiển thị thông báo lỗi
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error,
        confirmButtonColor: "#3085d6",
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Việc làm đã ứng tuyển
        </h1>
        {appliedJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <p className="text-gray-500 text-lg">
              Bạn chưa ứng tuyển công việc nào.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-violet-600 hover:underline"
            >
              Tìm công việc ngay →
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedJobs.map(({ job, company }, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <JobApplied job={job} company={company} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AppliedJobs;
