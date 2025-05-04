import { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { updateUser } from "../../service/user";
import Swal from "sweetalert2";

const UserInfoModal = ({ isOpen, onRequestClose, user }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const provinces = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
    "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
    "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
    "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
    "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
    "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
    "Thừa Thiên Huế", "Tiền Giang", "TP.HCM", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value.trim();
    const email = e.target.elements.email.value.trim();
    const location = e.target.elements.city.value;
    const dc = e.target.elements.dc.value.trim();
    const address = dc ? `${dc}, ${location}` : location;

    if (!location || location === "Chọn tỉnh") {
      setError("(*) Vui lòng chọn tỉnh");
      return;
    }

    const updatedUser = {
      ...user,
      fullName: name,
      email,
      location,
      address,
    };

    try {
      // Gửi dữ liệu cập nhật tới API
      const result = await updateUser(user.id, updatedUser);

      // Cập nhật vào Redux
      dispatch({ type: "UPDATE", user: updatedUser });

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        showConfirmButton: false,
        timer: 1500,
      });

      onRequestClose();
    } catch (error) {
      console.error("Update failed:", error);
      await Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại!",
        text: "Đã xảy ra lỗi khi lưu thông tin.",
      });
    }
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-6 w-full max-w-md"
    >
      <form className="relative" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

        <button
          onClick={closeModal}
          type="button"
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
        >
          &times;
        </button>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Họ và tên</label>
          <input
            type="text"
            id="name"
            defaultValue={user.fullName || ""}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            defaultValue={user.email || ""}
            className="border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-bold mb-2">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            defaultValue={user.phone || ""}
            readOnly
            className="bg-gray-100 border rounded w-full py-2 px-3"
          />
        </div>

        <div className="mb-4 flex gap-4">
          <div className="w-2/3">
            <label htmlFor="dc" className="block text-sm font-bold mb-2">Địa chỉ hiện tại</label>
            <input
              id="dc"
              defaultValue={user.address?.replace(`, ${user.location}`, "") || ""}
              placeholder="Số nhà, tên đường, quận/huyện"
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="w-1/3">
            <label htmlFor="city" className="block text-sm font-bold mb-2">
              Tỉnh/TP <span className="text-red-500">{error}</span>
            </label>
            <select
              id="city"
              defaultValue={user.location || ""}
              onChange={() => setError("")}
              className="border rounded w-full py-2 px-3 bg-white"
            >
              <option disabled value="">Chọn tỉnh</option>
              {provinces.map((x, i) => (
                <option key={i} value={x}>{x}</option>
              ))}
            </select>
          </div>
        </div>

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
    </Modal>
  );
};

export default UserInfoModal;
