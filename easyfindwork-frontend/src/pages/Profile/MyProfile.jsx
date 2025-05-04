import { useRef, useState } from "react";
import {Heart,  ChevronDown,  ChevronUp,  Edit,  Upload, Bell,  User,  Briefcase,Users, Info,FileText,} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserInfoModal from "./UserInfoModal ";
import { updateUser } from "../../service/user";
import DetailModal from "./DetailModal";
import RightSideBar from "./RightSideBar";
const MyProfile= ()=>{

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setOpenModal2]= useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const openModal2 = () => {
    setOpenModal2(true);
  };

  const closeModal = async() => {
    setIsModalOpen(false);
  };
  const closeModal2 =() => {
    setOpenModal2(false);
  };
  

  const user = useSelector((state) => state.user);
  const dispatch= useDispatch();


  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click(); // mở input file khi click ảnh
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // kết quả là base64
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await toBase64(file);
      // Cập nhật ảnh đại diện ở đây (tùy bạn dùng state hay gọi API)
      dispatch({
        type: "UPDATE_IMG",
        url: base64
      });
      const updatedUser = {
        ...user,        // Sao chép toàn bộ thông tin user cũ
        avatar: base64, // Cập nhật avatar mới
      };
      
      updateUser(user.id, updatedUser);
      console.log(user);
    }
  };

    return (
        
        <>
        <UserInfoModal isOpen={isModalOpen} onRequestClose={closeModal}  user={user} />
        <DetailModal isOpen={isModalOpen2} onRequestClose={closeModal2}  user={user}></DetailModal>
        
        <div className="flex-1 p-6 space-y-6">
            <div className="bg-white rounded-md shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Hồ sơ của tôi</h2>
                <button onClick={openModal} className="text-gray-500">
                  <Edit className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">

              <div className="flex-shrink-0 relative">
            {/* Input file ẩn */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {/* Ảnh và icon edit */}
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    <div className="flex items-center gap-1">
                      <span>Sẵn sàng đi làm ngay</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

                  <h3 className="text-3xl font-bold">{user.fullName}</h3>
                  {user.address !=null && (
                    <div className="flex items-start gap-2">
                    <img className="w-5 h-5" src="../../../public/location.png" alt="" />
                    <span className=" text-sm">{user.address}</span>
                    </div>
                  )}
                  {user.address ==null &&(
                    <button onClick={openModal} className="text-blue-500 text-sm">
                    Thêm địa chỉ
                  </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <img
                            src="../../public/email.png"
                            alt="mail"
                            className="w-5 h-5"
                          />
                          <span>{user.email}</span>
                        </div>

                        {/* <button className="text-blue-500 text-sm">Thêm số điện thoại</button> */}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <img
                          src="../../public/phone.png"
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

            <div className="bg-white rounded-md shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">CV của tôi</h2>
              </div>

              <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <button className="bg-purple-100 text-purple-700 px-6 py-3 rounded-md flex items-center gap-2 font-medium">
                  <Upload className="h-5 w-5" />
                  <span>Tải lên CV có sẵn</span>
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  Hỗ trợ định dạng: doc, docx, pdf, tối đa 5MB
                </p>
              </div>
            </div>

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
                    {user.desiredJob?user.desiredJob :"Thêm vị trí công việc"}
                  </button>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">
                    Mức lương mong muốn (triệu/tháng)
                  </p>
                  <button onClick={openModal2} className="text-blue-500">{user.desiredSalary?(user.desiredSalary/1000000) :"Thêm mức lương"}</button>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Kinh nghiệm</p>
                  <button onClick={openModal2} className="text-blue-500">{user.experience ?user.experience :"Thêm kinh nghiệm"}</button>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Trình độ</p>
                  <button onClick={openModal2} className="text-blue-500">
                    {user.education?user.education :"Thêm Trình độ"}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                  <p className="text-gray-500 mb-1">Kĩ năng</p>
                  <button onClick={openModal2} className="text-blue-500">
                    {user.skills? user.skills.join(", "):"Thêm kĩ năng"}
                  </button>
                </div>
            </div>
          </div>
          <RightSideBar/>
        </>
    )
}
export default MyProfile;