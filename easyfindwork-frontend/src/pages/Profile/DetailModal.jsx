import { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { updateUser } from "../../service/user";
import Swal from "sweetalert2";

// Reusable Input Field Component
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

const DetailModal = ({ isOpen, onRequestClose, user }) => {
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
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const newUser = {
      ...user,
      desiredJob: form.get("desiredJob"),
      desiredSalary: Number(form.get("desiredSalary")) * 1_000_000,
      experience: form.get("experience"),
      education: form.get("education"),
      skills: form
        .get("skills")
        .split(",")
        .map((s) => s.trim()),
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
      className="modal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-6 w-full max-w-md"
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
          defaultValue={
            user.desiredSalary ? user.desiredSalary / 1_000_000 : ""
          }
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
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-sm mr-2 focus:outline-none"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm focus:outline-none"
          >
            Lưu thông tin
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DetailModal;
