"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

const JobRecomend = ({ job, company }) => {
  const [liked, setLiked] = useState(false);

  // Xử lý nhấp vào icon Heart
  const handleHeartClick = (e) => {
    e.preventDefault(); // Ngăn Link kích hoạt khi nhấp vào Heart
    setLiked(!liked);
  };

  // Định dạng tiền lương
  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") : "N/A";
  };

  // Tính ngày còn lại đến hạn nộp
  const calculateDaysLeft = (deadline) => {
    if (!deadline) return "N/A";
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const diffTime = deadlineDate - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `Còn ${diffDays} ngày` : "Hết hạn";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow relative"
    >
      <Link to={`/job/${job.id}`} className="block">
        <div className="absolute top-4 right-4">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHeartClick}
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? "text-red-500 fill-red-500" : "text-gray-300"
              } hover:text-red-500 cursor-pointer`}
            />
          </motion.div>
        </div>

        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden mr-3">
            <img
              src={company?.logo || "https://via.placeholder.com/48"}
              alt="Company logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <h3 className="font-medium text-violet-600 text-lg hover:underline">
            {job.title || "Job Title"}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-3">
          {company?.name || "Company Name"}
        </p>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-2 h-4 w-4" />
            <span>{job.location || "Location"}</span>
          </div>
          <div className="flex items-center">
            <FaMoneyBillWave className="text-green-500 mr-2 h-4 w-4" />
            <span>
              {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}{" "}
              triệu
            </span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2 h-4 w-4" />
            <span>{calculateDaysLeft(job.deadline)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobRecomend;