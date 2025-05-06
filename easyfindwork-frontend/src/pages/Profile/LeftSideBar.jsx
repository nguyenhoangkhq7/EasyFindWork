import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, User, Briefcase, FileText } from "lucide-react"
import { useSelector } from "react-redux"
import { NavLink, useLocation } from "react-router-dom"

const LeftSideBar = () => {
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({
    jobManagement: false,
    recruiters: false,
    support: false,
  })

  // Kiểm tra xem có menu con nào đang active không
  const isJobManagementActive = location.pathname === "/" || location.pathname.includes("/profile/job-saved")

  // Mở menu khi có menu con đang active
  useEffect(() => {
    if (isJobManagementActive && !openMenus.jobManagement) {
      setOpenMenus((prev) => ({
        ...prev,
        jobManagement: true,
      }))
    }
  }, [location.pathname, isJobManagementActive])

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <>
      <div className="w-full md:w-80 bg-white p-6 shadow-sm overflow-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold">{user.fullName}</h2>
        </div>
        <nav className="space-y-1">
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `flex items-center p-3 rounded-md transition-colors duration-200 ${
                isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`mr-3 ${isActive ? "text-purple-700" : "text-gray-500"}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <span>Hồ sơ của tôi</span>
              </>
            )}
          </NavLink>

          {/* Job Management Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu("jobManagement")}
              className={`w-full flex items-center p-3 rounded-md justify-between transition-colors duration-200 ${
                isJobManagementActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <div className={`mr-3 ${isJobManagementActive ? "text-purple-700" : "text-gray-500"}`}>
                  <Briefcase className="h-5 w-5" />
                </div>
                <span>Quản lý việc làm</span>
              </div>
              {openMenus.jobManagement ? (
                <ChevronUp className={`h-4 w-4 ${isJobManagementActive ? "text-purple-700" : "text-gray-500"}`} />
              ) : (
                <ChevronDown className={`h-4 w-4 ${isJobManagementActive ? "text-purple-700" : "text-gray-500"}`} />
              )}
            </button>

            <div
              className={`ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                openMenus.jobManagement ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <NavLink
                to="/profile/applied-jobs"
                className={({ isActive }) =>
                  `block p-2 rounded-md transition-colors duration-200 ${
                    isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                Việc làm đã ứng tuyển
              </NavLink>
              <NavLink
                to="/profile/saved-jobs"
                className={({ isActive }) =>
                  `block p-2 rounded-md transition-colors duration-200 ${
                    isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                Việc làm đã lưu
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/profile/account"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-md transition-colors duration-200 ${
                isActive ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <div
              className={`mr-3 ${location.pathname.includes("/profile/account") ? "text-purple-700" : "text-gray-500"}`}
            >
              <User className="h-5 w-5" />
            </div>
            <span>Quản lý tài khoản</span>
          </NavLink>
        </nav>
      </div>
    </>
  )
}

export default LeftSideBar;
