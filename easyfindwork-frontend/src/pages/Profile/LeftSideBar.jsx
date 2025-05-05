import { useRef, useState } from "react";
import {Heart,  ChevronDown,  ChevronUp,  Edit,  Upload, Bell,  User,  Briefcase,Users, Info,FileText,} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserInfoModal from "./UserInfoModal ";
import { updateUser } from "../../service/user";
import DetailModal from "./DetailModal";

const LeftSideBar= ()=>{
    const user= useSelector(state=>state.user);
    const [openMenus, setOpenMenus] = useState({
        jobManagement: false,
        recruiters: false,
        support: false,
      });
    
      const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
          ...prev,
          [menu]: !prev[menu],
        }));
      };
    return (
        <>
        <div className="w-full md:w-80 bg-white p-6 shadow-sm overflow-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold">{user.fullName}</h2>
            </div>
            <nav className="space-y-1">
              <Link
                to="#"
                className="flex items-center p-3 text-purple-700 bg-purple-50 rounded-md"
              >
                <div className="mr-3 text-purple-700">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-medium">Hồ sơ của tôi</span>
              </Link>

            

              {/* Job Management Dropdown */}
              <div>
                <button
                  onClick={() => toggleMenu("jobManagement")}
                  className="w-full flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-md justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-gray-500">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <span>Quản lý việc làm</span>
                  </div>
                  {openMenus.jobManagement ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                <div
                  className={`ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    openMenus.jobManagement
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    to="/"
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    Việc làm đã ứng tuyển
                  </Link>
                  <Link
                    to="/profile/job-saved"
                    className="block p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    Việc làm đã lưu
                  </Link>
                  
                  
                </div>
              </div>

              <a
                href="#"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-md"
              >
                <div className="mr-3 text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <span>Quản lý tài khoản</span>
              </a>
            </nav>
          </div>
        </>
    )

}
export default LeftSideBar;