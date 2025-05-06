import { useDispatch } from "react-redux";
import { useState } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { updateUser } from "../../service/user";
import Swal from "sweetalert2";

// Input component như cũ
const InputField = ({ id, label, defaultValue, type = "text" }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-bold text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      defaultValue={defaultValue}
      className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
    />
  </div>
);

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const DetailModal = ({ isOpen, onRequestClose, user }) => {
  const dispatch = useDispatch();

  const closeModal = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn đóng?",
      text: "Mọi thay đổi chưa lưu sẽ bị mất!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      onRequestClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const newUser = {
      ...user,
      desiredJob: form.get("desiredJob"),
      desiredSalary: Number(form.get("desiredSalary")) * 1_000_000,
      experience: form.get("experience"),
      education: form.get("education"),
      skills: form.get("skills").split(",").map((s) => s.trim()),
    };

    try {
      await updateUser(user.id, newUser);
      dispatch({ type: "UPDATE", user: newUser });

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: () => Swal.showLoading(),
        willClose: onRequestClose,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi cập nhật",
        text: "Vui lòng thử lại!",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
      className="outline-none "
      ariaHideApp={false}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="job-modal"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-md shadow-lg p-6 w-[40vw] max-w-5xl relative"
          >
            <form className="relative" onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold mb-4">Tiêu chí tìm việc</h2>

              <button
                type="button"
                onClick={closeModal}
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
              >
                &times;
              </button>

              <InputField
                id="desiredJob"
                label="Vị trí công việc"
                defaultValue={user.desiredJob || ""}
              />
              <InputField
                id="desiredSalary"
                label="Mức lương mong muốn (triệu/tháng)"
                type="number"
                defaultValue={user.desiredSalary ? user.desiredSalary / 1_000_000 : ""}
              />
              <InputField
                id="experience"
                label="Kinh nghiệm"
                defaultValue={user.experience || ""}
              />
              <InputField
                id="education"
                label="Trình độ"
                defaultValue={user.education || ""}
              />
              <InputField
                id="skills"
                label="Kĩ năng (cách nhau bằng dấu phẩy)"
                defaultValue={user.skills?.join(", ") || ""}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Lưu thông tin
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default DetailModal;
