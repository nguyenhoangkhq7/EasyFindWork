import { useState } from "react"
import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../service/user"


export default function AccountManagement() {
  const [isOpen, setIsOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editType, setEditType] = useState("") // "email" or "phone"
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [error, setError] = useState("") // State để lưu thông báo lỗi

  const user= useSelector(state=>state.user);
  const [email, setEmail] = useState(user.email?user.email:"");
  const [phone, setPhone] = useState(user.phone? user.phone:"");

  const dispatch= useDispatch();
  const toggleOpen = () => setIsOpen(!isOpen);

  const handleEditClick = (type) => {
    setEditType(type);
    if (type === "email") {
      setNewEmail("");
    } else if (type === "phone") {
      setNewPhone("");
    }
    setError(""); // Reset lỗi khi mở modal
    setIsModalOpen(true);
  }

  const handleSave = () => {
    let newUser;
    // Kiểm tra email
    if (editType === "email") {
      if (!newEmail) {
        setError("Email không được để trống");
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(newEmail)) {
        setError("Email không hợp lệ");
        return;
      }
      setEmail(newEmail);
      newUser= {...user, email: newEmail};
      

    }

    // Kiểm tra số điện thoại
    if (editType === "phone") {
      if (!newPhone) {
        setError("Số điện thoại không được để trống");
        return;
      }
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(newPhone)) {
        setError("Số điện thoại phải có 10 chữ số");
        return
      }
      setPhone(newPhone);
      newUser= {...user, phone: newPhone};
    }

    // Nếu không có lỗi, đóng modal và reset thông báo lỗi
    updateUser(user.id, newUser);
      dispatch({
        type: "UPDATE",
        user: newUser
      });
    setIsModalOpen(false);
    setError("");
  }

  const customStyles = {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      border: "none",
      borderRadius: "0.5rem",
      maxWidth: "500px",
      width: "90%",
      padding: 0,
    },
  }

  return (
    <div className="w-full mx-auto p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <button onClick={toggleOpen} className="w-full flex items-center justify-between p-4 text-left">
          <h2 className="text-lg font-bold text-gray-900">Thông tin đăng ký</h2>
        </button>

        {isOpen && (
          <>
            {/* Email Section */}
            <div className="p-4 pt-0 border-t border-gray-100">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700 min-w-24">Email</span>
                  <div className="w-[350px] flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md">
                    <span className="text-gray-900">{email}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick("email")}
                  className="w-[200px] flex items-center justify-center px-4 py-2 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  Sửa email
                </button>
              </div>
            </div>

            {/* Phone Section */}
            <div className="p-4 pt-0 border-t border-gray-100">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700 min-w-24">Số điện thoại</span>
                  <div className="w-[350px] flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md">
                    <span className="text-gray-900">{phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick("phone")}
                  className="w-[200px] flex items-center justify-center px-4 py-2 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100"
                >
                  Sửa số điện thoại
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Common Modal for Email or Phone */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={customStyles}>
        <div className="w-full">
          <div className="p-6 text-center border-b">
            <h2 className="text-xl font-semibold">
              {editType === "email" ? "Thay đổi email" : "Thay đổi số điện thoại"}
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {editType === "email" ? "Email hiện tại" : "SĐT hiện tại"}
              </label>
              <input
                type={editType === "email" ? "email" : "text"}
                value={editType === "email" ? email : phone}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {editType === "email" ? "Email mới" : "SĐT mới"}
              </label>
              <input
                type={editType === "email" ? "email" : "text"}
                value={editType === "email" ? newEmail : newPhone}
                onChange={(e) => {
                    editType === "email" ? setNewEmail(e.target.value) : setNewPhone(e.target.value);
                    setError("");
                }}
                placeholder={editType === "email" ? "Nhập email mới" : "Nhập số điện thoại mới"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:ring-2"
              />
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
          <div className="p-6 border-t flex flex-col sm:flex-row gap-3">
            <button onClick={() => setIsModalOpen(false)} className="w-full sm:w-1/2 border rounded-md px-4 py-2">
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-1/2 bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700"
            >
              Lưu
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
