import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaChevronDown, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/images/avatar.png");
  let timeoutId = null;

  useEffect(() => {
    fetch("https://api.example.com/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
      })
      .catch(() => setAvatarUrl("/images/avatar.png"));
  }, []);

  const handleMouseEnterJob = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsJobDropdownOpen(true);
  };

  const handleMouseLeaveJob = () => {
    timeoutId = setTimeout(() => {
      setIsJobDropdownOpen(false);
    }, 200);
  };

  const handleMouseEnterUser = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsUserDropdownOpen(true);
  };

  const handleMouseLeaveUser = () => {
    timeoutId = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 200);
  };

  return (
    <div className="w-full shadow-md">
      {/* Top banner */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="flex items-center gap-3">
          <img
            src="https://placehold.co/40x40?text=EFW"
            alt="Logo"
            className="w-10 h-10 object-contain rounded-full shadow-sm"
          />
          <span className="text-gray-700 text-sm font-medium">
            Easy Find Work - Ứng tuyển ngay
          </span>
        </div>
        <Link
          to="/apply"
          className="px-6 py-2 text-white bg-violet-600 rounded-full hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Ứng tuyển
        </Link>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between px-6 py-4 bg-violet-800 text-white">
        <div className="flex items-center gap-8">
          {/* Logo brand */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-all duration-300 hover:opacity-90"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-violet-800 shadow-lg">
              <span className="text-2xl font-extrabold">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                EasyFindWork
              </span>
              <span className="text-xs opacity-80">nhanh hơn, dễ dàng hơn</span>
            </div>
          </Link>

          {/* Navigation - Job Dropdown */}
          <div
            className="relative group"
            onMouseEnter={handleMouseEnterJob}
            onMouseLeave={handleMouseLeaveJob}
          >
            <button className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4 transition-all duration-200">
              Cơ hội việc làm
              <FaChevronDown
                className={`text-xs transition-transform duration-300 ${
                  isJobDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isJobDropdownOpen && (
              <div className="absolute top-full left-0 mt-0 bg-white text-gray-800 rounded-xl shadow-2xl p-4 w-64 z-10 animate-fadeIn">
                <Link
                  to="/jobs/marketing"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterJob}
                  onMouseLeave={handleMouseLeaveJob}
                >
                  <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                  Marketing
                </Link>
                <Link
                  to="/jobs/it"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterJob}
                  onMouseLeave={handleMouseLeaveJob}
                >
                  <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                  Công nghệ thông tin (IT)
                </Link>
                <Link
                  to="/jobs/sales"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterJob}
                  onMouseLeave={handleMouseLeaveJob}
                >
                  <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                  Kinh doanh - Bán hàng
                </Link>
                <Link
                  to="/jobs/design"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterJob}
                  onMouseLeave={handleMouseLeaveJob}
                >
                  <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                  Thiết kế - Đa phương tiện
                </Link>
                <Link
                  to="/jobs/hr"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterJob}
                  onMouseLeave={handleMouseLeaveJob}
                >
                  <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                  Nhân sự - Hành chính
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User section */}
        <div className="flex items-center gap-5">
          <button className="relative group">
            <FaBell className="text-xl group-hover:text-yellow-400 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center border-2 border-violet-800 group-hover:border-yellow-400 transition-colors duration-200">
              3
            </span>
          </button>
          <div
            className="relative group"
            onMouseEnter={handleMouseEnterUser}
            onMouseLeave={handleMouseLeaveUser}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-yellow-400 transition-all duration-200">
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium group-hover:text-yellow-400 transition-colors duration-200">
                  Tài khoản
                </span>
                <FaChevronDown
                  className={`text-xs group-hover:text-yellow-400 transition-all duration-200 ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-0 bg-white text-gray-800 rounded-xl shadow-2xl p-4 w-48 z-10 animate-fadeIn">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterUser}
                  onMouseLeave={handleMouseLeaveUser}
                >
                  <FaUser className="text-violet-500" />
                  Tài khoản
                </Link>
                <Link
                  to="/logout"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                  onMouseEnter={handleMouseEnterUser}
                  onMouseLeave={handleMouseLeaveUser}
                >
                  <FaSignOutAlt className="text-violet-500" />
                  Đăng xuất
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
