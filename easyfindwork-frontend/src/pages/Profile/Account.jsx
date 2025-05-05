"use client";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Account = () => {
  const user = useSelector((state) => state.user);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen"
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Quản lý tài khoản
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin tài khoản
        </h2>
        <div className="space-y-4">
          <p>
            <span className="font-medium">Họ và tên:</span>{" "}
            {user?.fullName || "Chưa cập nhật"}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {user?.email || "Chưa cập nhật"}
          </p>
          <p className="text-gray-500">
            Tính năng quản lý tài khoản (đổi mật khẩu, cập nhật thông tin, v.v.)
            sẽ sớm được triển khai!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Account;
