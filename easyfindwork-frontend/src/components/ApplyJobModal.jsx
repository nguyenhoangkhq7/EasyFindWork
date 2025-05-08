"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// ApplyJobModal Component
const ApplyJobModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!fullName || !email || !phone) {
      setErrorMessage(
        "Vui lòng điền đầy đủ thông tin họ tên, email và số điện thoại."
      );
      return;
    }
    if (!selectedResumeId && !cvFile) {
      setErrorMessage("Vui lòng chọn CV có sẵn hoặc tải lên CV mới.");
      return;
    }

    try {
      const userId = user.id;
      let resumeId = selectedResumeId;
      let fileUrl, fileName, fileSize;

      // If a new file is uploaded
      if (cvFile) {
        const formData = new FormData();
        formData.append("file", cvFile);
        formData.append("upload_preset", "easyfindwork_upload");
        formData.append("folder", "cv_apply");

        // Upload file to Cloudinary
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dzcodbajo/raw/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        fileUrl = cloudinaryResponse.data.secure_url;
        fileName = cvFile.name;
        fileSize = cvFile.size;

        // Update user's CVs in Redux state
        const newCv = {
          id: `cv_${Date.now()}`,
          fileName,
          fileUrl,
          fileSize,
          uploadedAt: new Date().toISOString(),
        };
        const updatedCvs = [...(user.cvs || []), newCv];
        dispatch({
          type: "UPDATE_USER",
          payload: { ...user, cvs: updatedCvs },
        });

        resumeId = newCv.id;
      }

      // Save application to json-server
      await axios.post("http://localhost:3000/applications", {
        id: `application_${Date.now()}`,
        userId,
        jobId,
        resumeId,
        appliedDate: new Date().toISOString(),
        status: "Đang xử lý",
        note: "",
      });

      setSuccessMessage("Đã nộp hồ sơ thành công!");
      setErrorMessage("");
      setTimeout(() => {
        onClose();
        setFullName("");
        setEmail("");
        setPhone("");
        setCvFile(null);
        setSelectedResumeId("");
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error applying for job:", error.response || error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay mờ */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Modal nội dung */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Ứng tuyển vị trí <br />
              <span className="font-bold">{jobTitle}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
          {successMessage && (
            <div className="text-green-600 bg-green-50 p-3 rounded-md mb-4">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ tên của bạn"
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chọn CV có sẵn
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              >
                <option value="">Chọn CV đã tải lên</option>
                {(user.cvs || []).map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.fileName} (
                    {new Date(resume.uploadedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hoặc tải lên CV mới
              </label>
              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hỗ trợ định dạng .doc, .docx, .pdf, tối đa 5MB
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-[#6B46C1] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#5a3aa6] transition-all duration-300 transform hover:scale-102 shadow-md"
            >
              Nộp hồ sơ ngay
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Bằng việc nhấn nút Nộp hồ sơ, bạn đồng ý với{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-violet-600 hover:underline">
              Chính sách bảo mật
            </a>{" "}
            của Vieclam24h.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default ApplyJobModal;
