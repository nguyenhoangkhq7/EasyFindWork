import { useRef, useState } from "react";
import {
  Heart,
  ChevronDown,
  ChevronUp,
  Edit,
  Upload,
  Bell,
  User,
  Briefcase,
  Users,
  Info,
  FileText,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import UserInfoModal from "./UserInfoModal";
import { updateUser } from "../../service/user";
import DetailModal from "./DetailModal";
import JobRecommendBar from "./JobRecommendBar";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CryptoJS from "crypto-js";
import { uploadFileByUrl, deleteFileByUrl } from "../../service/cloudinary";

const MyProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setOpenModal2] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availability, setAvailability] = useState("Sẵn sàng đi làm ngay");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector((state) => state.user);
  console.log(user);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    setIsDropdownOpen(false);
  };

  const openModal = () => setIsModalOpen(true);
  const openModal2 = () => setOpenModal2(true);
  const closeModal = () => setIsModalOpen(false);
  const closeModal2 = () => setOpenModal2(false);

  const handleAvatarClick = () => fileInputRef.current.click();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const base64 = await toBase64(file);
  //     dispatch({ type: "UPDATE_IMG", url: base64 });
  //     const updatedUser = { ...user, avatar: base64 };
  //     await updateUser(user.id, updatedUser);
  //   }
  // };
  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //     // 2. Xoá ảnh cũ nếu có

  //     // 3. Cập nhật user avatar mới
  //     const updatedUser = { ...user, avatar: newAvatarUrl };
  //     dispatch({ type: "UPDATE_IMG", url: newAvatarUrl });
  //     await updateUser(user.id, updatedUser);

  //     setSuccessMessage("Cập nhật ảnh thành công!");
  //     setTimeout(() => setSuccessMessage(""), 3000);
  // };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 1. Xóa ảnh cũ nếu có
    if (user.avatar) {
      try {
        await deleteFileByUrl(user.avatar, "image");
        console.log("Ảnh cũ đã bị xóa thành công.");
      } catch (error) {
        setErrorMessage("Lỗi khi xóa ảnh cũ, ảnh mới sẽ không được cập nhật.");
        console.error("Error deleting old image:", error);
        return;
      }
    }

    // 2. Upload ảnh mới lên Cloudinary
    try {
      const response = await uploadFileByUrl(file, "image");

      // Tạo object avatar với secure_url (chỉ lưu link)
      const newAvatar = response.data.secure_url;

      // Cập nhật avatar mới cho người dùng
      const updatedUser = { ...user, avatar: newAvatar };

      // Cập nhật thông tin người dùng trong Redux và cơ sở dữ liệu
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      await updateUser(user.id, updatedUser);

      setSuccessMessage("Cập nhật ảnh thành công!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Lỗi khi tải ảnh lên, vui lòng thử lại.");
      console.error("Error uploading image:", error);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    const response = await uploadFileByUrl(file, "raw"); // Sử dụng hàm uploadFileByUrl từ service/cloudinary
    // tạo resume
    const newCv = {
      id: `cv_${Date.now()}`,
      fileName: file.name,
      fileUrl: response.data.secure_url,
      publicId: response.data.public_id, // Lưu public_id từ Cloudinary
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };

    const currentCvs = Array.isArray(user.cvs) ? user.cvs : [];
    const updatedCvs = [...currentCvs, newCv];
    const updatedUser = { ...user, cvs: updatedCvs };

    dispatch({ type: "UPDATE_USER", payload: updatedUser });
    await updateUser(user.id, updatedUser);

    setSuccessMessage("Tải CV lên thành công!");
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCvDelete = async (cvId, fileUrl) => {
    const result = deleteFileByUrl(fileUrl, "raw"); // Xóa file trên Cloudinary
    if (result) {
      // Cập nhật danh sách CV và trạng thái
      const updatedCvs = (user.cvs || []).filter((cv) => cv.id !== cvId);
      const updatedUser = { ...user, cvs: updatedCvs };

      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      await updateUser(user.id, updatedUser);

      setSuccessMessage("Xóa CV thành công!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <UserInfoModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        user={user}
      />
      <DetailModal
        isOpen={isModalOpen2}
        onRequestClose={closeModal2}
        user={user}
      />

      <motion.div
        className="flex-1 p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Thông báo thành công/lỗi */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-green-600 bg-green-50 p-3 rounded-md mb-4"
            >
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-red-600 bg-red-50 p-3 rounded-md mb-4"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hồ sơ của tôi */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Hồ sơ của tôi</h2>
            <button onClick={openModal} className="text-gray-500">
              <Edit className="h-5 w-5" />
            </button>
          </div>

          {/* chỉnh sửa hình ảnh */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div
                className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center relative cursor-pointer"
                onClick={handleAvatarClick}
              >
                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.fullName}
                />
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                  <Edit className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="relative inline-block text-left">
                <div
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{availability}</span>
                  {isDropdownOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
                    {[
                      "Sẵn sàng đi làm ngay",
                      "Không sẵn sàng",
                      "Cần trao đổi thêm",
                    ].map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                        onClick={() => handleAvailabilityChange(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="text-3xl font-bold">{user.fullName}</h3>
              {user.address ? (
                <div className="flex items-start gap-2">
                  <img className="w-5 h-5" src="/public/location.png" alt="" />
                  <span className="text-sm">{user.address}</span>
                </div>
              ) : (
                <button onClick={openModal} className="text-blue-500 text-sm">
                  Thêm địa chỉ
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <img
                        src="/public/email.png"
                        alt="mail"
                        className="w-5 h-5"
                      />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="/public/phone.png"
                      alt="phone"
                      className="w-5 h-5"
                    />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CV của tôi */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">CV của tôi</h2>
          </div>

          <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center mb-6">
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              className="hidden"
              ref={cvInputRef}
              onChange={handleCvUpload}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-6 py-3 rounded-md flex items-center gap-2 font-medium hover:bg-blue-600 transition-colors"
              onClick={() => cvInputRef.current.click()}
            >
              <Upload className="h-5 w-5" />
              <span>Tải lên CV có sẵn</span>
            </motion.button>
            <p className="text-gray-500 text-sm mt-2">
              Hỗ trợ định dạng: doc, docx, pdf, tối đa 5MB
            </p>
          </div>

          {/* Danh sách CV */}
          <AnimatePresence>
            {Array.isArray(user.cvs) && user.cvs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {user.cvs.map((cv) => (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <a
                          href={cv.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {cv.fileName}
                        </a>
                        <p className="text-sm text-gray-500">
                          Kích thước: {formatFileSize(cv.fileSize)} | Tải lên:{" "}
                          {new Date(cv.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleCvDelete(cv.id, cv.fileUrl)}
                      title="Xóa CV"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center py-4"
              >
                Chưa có CV nào được tải lên.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tiêu chí tìm việc */}
        <div className="bg-white rounded-md shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Tiêu chí tìm việc</h2>
            <button onClick={openModal2} className="text-gray-500">
              <Edit className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 mb-1">Vị trí công việc</p>
              <button onClick={openModal2} className="text-blue-500">
                {user.desiredJob ? user.desiredJob : "Thêm vị trí công việc"}
              </button>
            </div>
            <div>
              <p className="text-gray-500 mb-1">
                Mức lương mong muốn (triệu/tháng)
              </p>
              <button onClick={openModal2} className="text-blue-500">
                {user.desiredSalary
                  ? user.desiredSalary / 1000000
                  : "Thêm mức lương"}
              </button>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Kinh nghiệm</p>
              <button onClick={openModal2} className="text-blue-500">
                {user.experience ? user.experience : "Thêm kinh nghiệm"}
              </button>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Trình độ</p>
              <button onClick={openModal2} className="text-blue-500">
                {user.education ? user.education : "Thêm trình độ"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-500 mb-1">Kĩ năng</p>
            <button onClick={openModal2} className="text-blue-500">
              {user.skills ? user.skills.join(", ") : "Thêm kĩ năng"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <JobRecommendBar />
      </motion.div>
    </>
  );
};

export default MyProfile;
