"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { uploadFileByUrl } from "../service/cloudinary"; // Giả định bạn đã tạo hàm này trong service/cloudinary.jsx
import { updateUser } from "../service/user"; // Giả định bạn đã tạo hàm này trong service/userService.jsx

export default function ApplyJobModal({ isOpen, onClose, jobId, jobTitle }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [saveCv, setSaveCv] = useState(false);
  const [cvOption, setCvOption] = useState("existing");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleCvOptionChange = (option) => {
    setCvOption(option);
    if (option === "existing") {
      setCvFile(null);
      setSaveCv(false);
    } else {
      setSelectedResumeId("");
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await uploadFileByUrl(file, "raw");
    if (response) {
      const newCv = {
        id: `cv_${Date.now()}`,
        fileName: file.name,
        fileUrl: response.data.secure_url,
        publicId: response.data.public_id,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };

      if (saveCv) {
        const currentCvs = Array.isArray(user.cvs) ? user.cvs : [];
        const updatedCvs = [...currentCvs, newCv];
        const updatedUser = { ...user, cvs: updatedCvs };

        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        await updateUser(user.id, updatedUser);
      }

      setSuccessMessage("Tải CV lên thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return newCv.fileUrl; // Trả về fileUrl thay vì id
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      let fileUrl;

      if (cvFile) {
        // Tải lên CV mới
        fileUrl = await handleCvUpload({ target: { files: [cvFile] } });
        if (!fileUrl) {
          setErrorMessage("Tải lên CV thất bại.");
          return;
        }
      } else {
        // Lấy fileUrl từ CV có sẵn dựa trên selectedResumeId
        const selectedCv = user.cvs.find((cv) => cv.id === selectedResumeId);
        fileUrl = selectedCv ? selectedCv.fileUrl : "";
      }

      // Tạo application với fileUrl thay vì cvId
      const applicationData = {
        id: `application_${Date.now()}`,
        userId,
        fullName,
        phone,
        email,
        jobId,
        fileUrl, // Sử dụng fileUrl thay vì cvId
        appliedDate: new Date().toISOString(),
        status: "Đang xử lý",
        note: "",
        interviewDate: null,
        rejectionReason: null,
        hiringManagerId: "manager_001",
        isShortlisted: false,
      };

      await axios.post(
        "https://easyfindwork-jsonserver-production.up.railway.app/applications",
        applicationData
      );

      setSuccessMessage("Đã nộp hồ sơ thành công!");
      setErrorMessage("");
      setTimeout(() => {
        onClose();
        setFullName("");
        setEmail("");
        setPhone("");
        setCvFile(null);
        setSelectedResumeId("");
        setSaveCv(false);
        setCvOption("existing");
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
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn phương thức nộp CV *
              </label>
              <div className="flex space-x-4 mb-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="existingCv"
                    name="cvOption"
                    value="existing"
                    checked={cvOption === "existing"}
                    onChange={() => handleCvOptionChange("existing")}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                  />
                  <label
                    htmlFor="existingCv"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Sử dụng CV có sẵn
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="newCv"
                    name="cvOption"
                    value="new"
                    checked={cvOption === "new"}
                    onChange={() => handleCvOptionChange("new")}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300"
                  />
                  <label htmlFor="newCv" className="ml-2 text-sm text-gray-700">
                    Tải lên CV mới
                  </label>
                </div>
              </div>

              {cvOption === "existing" && (
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
              )}

              {cvOption === "new" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tải lên CV mới
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
                  {cvFile && (
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="saveCv"
                        checked={saveCv}
                        onChange={(e) => setSaveCv(e.target.checked)}
                        className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="saveCv"
                        className="text-sm font-medium text-gray-700"
                      >
                        Lưu CV mới vào danh sách CV của bạn
                      </label>
                    </div>
                  )}
                </div>
              )}
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
}
