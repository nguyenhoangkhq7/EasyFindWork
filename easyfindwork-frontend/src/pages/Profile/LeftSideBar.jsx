"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Briefcase,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const LeftSideBar = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({
    jobManagement: false,
  });

  // Theo dõi đường dẫn hiện tại để xác định menu item được chọn
  const [activePath, setActivePath] = useState(location.pathname);

  // Cập nhật activePath khi đường dẫn thay đổi
  useEffect(() => {
    setActivePath(location.pathname);
    // Nếu đang ở route con của jobManagement, mở dropdown
    if (
      ["/profile/applied-jobs", "/profile/saved-jobs"].includes(
        location.pathname
      )
    ) {
      setOpenMenus((prev) => ({ ...prev, jobManagement: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Hàm kiểm tra xem menu item có được chọn không
  const isActive = (path) => activePath === path;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-80 bg-white p-6 shadow-lg rounded-xl overflow-auto"
    >
      {/* User Info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {user?.fullName || "Người dùng"}
        </h2>
        <p className="text-sm text-gray-500">
          {user?.email || "Chưa có email"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {/* Hồ sơ của tôi */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Link
            to="/profile"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive("/profile")
                ? "text-violet-700 bg-violet-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText
              className={`h-5 w-5 mr-3 ${
                isActive("/profile") ? "text-violet-700" : "text-gray-500"
              }`}
            />
            <span className="font-medium">Hồ sơ của tôi</span>
          </Link>
        </motion.div>

        {/* Quản lý việc làm Dropdown */}
        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => toggleMenu("jobManagement")}
            className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg justify-between transition-colors"
          >
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-3 text-gray-500" />
              <span>Quản lý việc làm</span>
            </div>
            <motion.div
              animate={{ rotate: openMenus.jobManagement ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {openMenus.jobManagement ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </motion.div>
          </motion.button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: openMenus.jobManagement ? "auto" : 0,
              opacity: openMenus.jobManagement ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="ml-8 mt-1 space-y-1 overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/profile/applied-jobs"
                className={`block p-2 rounded-lg transition-colors ${
                  isActive("/profile/applied-jobs")
                    ? "text-violet-700 bg-violet-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Việc làm đã ứng tuyển
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/profile/saved-jobs"
                className={`block p-2 rounded-lg transition-colors ${
                  isActive("/profile/saved-jobs")
                    ? "text-violet-700 bg-violet-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Việc làm đã lưu
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Quản lý tài khoản */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Link
            to="/profile/account"
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive("/profile/account")
                ? "text-violet-700 bg-violet-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <User
              className={`h-5 w-5 mr-3 ${
                isActive("/profile/account")
                  ? "text-violet-700"
                  : "text-gray-500"
              }`}
            />
            <span>Quản lý tài khoản</span>
          </Link>
        </motion.div>
      </nav>
    </motion.div>
  );
};

export default LeftSideBar;
