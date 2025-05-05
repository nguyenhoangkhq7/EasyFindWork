import { useRef, useState } from "react";
// import {Heart,  ChevronDown,  ChevronUp,  Edit,  Upload, Bell,  User,  Briefcase,Users, Info,FileText,} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import UserInfoModal from "./UserInfoModal ";
import { updateUser } from "../../service/user";
import DetailModal from "./DetailModal";
import LeftSideBar from "./LeftSideBar";
import RigthSideBar from "./JobRecommendBar";


export default function Profile() {

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
      {user && (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 w-full">

          <LeftSideBar/>
          
          <Outlet/>

          
        </div>
      )}
    </>
  );
}
