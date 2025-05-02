import { Link } from "react-router-dom";
import { FaFacebook, FaSkype } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-violet-800 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold border-b-2 border-yellow-400 pb-2">
              Thông tin chúng tôi
            </h3>
            <p className="text-gray-300">
              Easy Find Work - Công ty cổ phần SleepSoon
            </p>
            <p className="text-gray-300">
              Địa chỉ: 12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh
            </p>
            <p className="text-gray-300">
              Số điện thoại:{" "}
              <a
                href="tel:0123456789"
                className="hover:text-yellow-400 transition-colors"
              >
                0123456789
              </a>
            </p>
            <p className="text-gray-300">
              Email:{" "}
              <a
                href="mailto:easyfindwork@gmail.com"
                className="hover:text-yellow-400 transition-colors"
              >
                easyfindwork@gmail.com
              </a>
            </p>
          </div>

          {/* Information Links */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold border-b-2 border-yellow-400 pb-2">
              Thông tin
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 hover:underline underline-offset-4"
                >
                  Báo giá dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 hover:underline underline-offset-4"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-yellow-400 transition-all duration-200 hover:underline underline-offset-4"
                >
                  Quy định bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-yellow-400 pb-2">
              Liên hệ
            </h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 rounded-lg p-3 hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://skype.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 rounded-lg p-3 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <FaSkype size={24} />
              </a>
              <a
                href="mailto:easyfindwork@gmail.com"
                className="bg-red-500 rounded-lg p-3 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <MdEmail size={24} />
              </a>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-violet-800 shadow-lg">
                <span className="text-2xl font-extrabold">E</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">
                  Easy Find Work
                </span>
                <span className="text-xs text-gray-400">
                  nhanh hơn, dễ dàng hơn
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-violet-700 py-4 text-center text-sm bg-violet-900">
        <p className="text-gray-300">© 2025 Bản quyền thuộc SleepSoon</p>
      </div>
    </footer>
  );
}
