import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaChevronDown, FaUser, FaSignOutAlt } from "react-icons/fa";
import Modal from "react-modal";
import { addUser, getUserWithMobilePhoneOrEmail } from "../service/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getIndustryJobIsActive } from "../service/job";
import OTPModal from "./OTPModal";
import { sendOtpToEmail } from "../untils/email";
import Swal from "sweetalert2";

// Modal.setAppElement("#root"); // For accessibility

export default function Header() {
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [otpCode, setOtpCode] = useState();

  let timeoutId = null;

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

  // Modal logic
  const [placeholderText, setPlaceholderText] = useState("Nhập Số điện thoại");
  const [loginWithMobile, setLoginMobile] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isShowInfor, setShowInfor] = useState(false);
  const [isShowOTPModal, setShowOTPModal] = useState(false);
  const [usserSingIn, setUserSignIn] = useState(null);
  const [emailReceivedOtp, setEmailReceiveOTP] = useState("");

  const [errorName, setErrorName] = useState();
  const [errorEmail, setErrorEmail] = useState();

  const [jobIndustry, setJobIndustry] = useState();

  const user = useSelector((state) => state.user);
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const openModal = () => {
    reload();
    dispatch({ type: "OPEN_LOGIN_MODAL" });
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_LOGIN_MODAL" });
    reload();
  };

  const openOtpModal = () => {
    setShowOTPModal(true);
  };

  const closeOtpModal = () => {
    setShowOTPModal(false);
  };

  const handleLoginWithMethod = () => {
    setLoginMobile(!loginWithMobile);
    setPlaceholderText(!loginWithMobile ? "Nhập Số điện thoại" : "Nhập Email");
    setInputValue("");
    setError("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError("");
  };

  const handleInputName = () => {
    setErrorName("");
  };

  const handleInputPhoneChange = (e) => {
    setError("");
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    const isPhoneLogin = loginWithMobile;

    if (isPhoneLogin && !phoneRegex.test(inputValue)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
      return;
    } else if (!isPhoneLogin && inputValue === "") {
      setError("Vui lòng nhập email.");
      return;
    }

    const user_now = await getUserWithMobilePhoneOrEmail(inputValue);
    if (!user_now) {
      setShowInfor(true);
      setEmailReceiveOTP(inputValue);
      return;
    }

    dispatch({
      type: "LOGIN",
      user: user_now,
    });
    closeModal();
  };

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleCompleted = async (e) => {
    e.preventDefault();
    const fullName = e.target.elements.fullName.value.trim();
    const email = e.target.elements.email.value.trim();
    setEmailReceiveOTP(email);
    const phone = e.target.elements.phone.value.trim();
    const nameRegex = /^([A-Za-zÀ-ỹà-ỹ]+)(\s[A-Za-zÀ-ỹà-ỹ]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!nameRegex.test(fullName)) {
      setErrorName("Tên không chứa số và kí tự đặc biệt.");
      return;
    }
    const new_user = { fullName, email, phone };
    setUserSignIn(new_user);

    // Phone login
    if (loginWithMobile) {
      if (!emailRegex.test(email)) {
        setErrorEmail("Chưa đúng định dạng email.");
        return;
      }
      const checkUser = await getUserWithMobilePhoneOrEmail(email);
      if (checkUser != null) {
        setErrorEmail("Email đã được sử dụng.");
        return;
      }

      await addNewUserWhenSignIn(new_user);
      closeModal();
    }
    // Email login
    else {
      if (!phoneRegex.test(phone)) {
        setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
        return;
      }
      const checkUser = await getUserWithMobilePhoneOrEmail(phone);
      if (checkUser != null) {
        setError("Số điện thoại đã được sử dụng.");
        return;
      }

      const otp_gener = generateOTP();
      setOtpCode(otp_gener);
      await sendOtpToEmail(emailReceivedOtp, otp_gener);
      console.log("ma otp: ", otp_gener);

      openOtpModal();
    }
  };

  const addNewUserWhenSignIn = async (new_user) => {
    try {
      const result = await addUser(new_user);
      dispatch({
        type: "LOGIN",
        user: result,
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const reload = () => {
    setError("");
    setErrorEmail("");
    setErrorName("");
    setLoginMobile(true);
    setShowInfor(false);
    setPlaceholderText("Nhập số điện thoại");
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  // Job industry fetching
  useEffect(() => {
    const fetchJobIndustry = async () => {
      try {
        const jobIsActive = await getIndustryJobIsActive();
        setJobIndustry(jobIsActive);
      } catch (error) {
        console.error("Error fetching job industries:", error);
        setJobIndustry([]);
      }
    };

    fetchJobIndustry();
  }, []);

  // OTP handling
  const handleOtp = async (otp) => {
    if (otp == otpCode) {
      closeModal();
      closeOtpModal();
      await addNewUserWhenSignIn(usserSingIn);
    } else {
      Swal.fire({
        icon: "error",
        title: "Đăng kí thất bại...",
        text: "Vui lòng thử lại!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  return (
    <div className="w-full shadow-md">
      <OTPModal
        isOpen={isShowOTPModal}
        onClose={closeOtpModal}
        email={emailReceivedOtp}
        otpCode={otpCode}
        sentParent={handleOtp}
        onBack={closeOtpModal}
      />
      {/* Top banner */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 object-contain rounded-full shadow-sm"
          />
          <span className="text-gray-700 text-sm font-medium">
            Easy Find Work - Ứng tuyển ngay
          </span>
        </div>
        <Link
          to="/job-search"
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
            {isJobDropdownOpen && jobIndustry && (
              <div className="absolute top-full left-0 mt-0 bg-white text-gray-800 rounded-xl shadow-2xl p-4 w-64 z-10 animate-fadeIn">
                <div className="max-h-96 overflow-y-auto">
                  {jobIndustry.map((item, index) => (
                    <JobOpportunityLink
                      key={index}
                      item={item}
                      handleMouseEnterJob={handleMouseEnterJob}
                      handleMouseLeaveJob={handleMouseLeaveJob}
                    />
                  ))}
                </div>
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
            {user != null && (
              <>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-yellow-400 transition-all duration-200">
                    <img
                      src={user.avatar || "/images/avatar.png"}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium group-hover:text-yellow-400 transition-colors duration-200">
                      {user.fullName}
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
                    <button
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
                      onMouseEnter={handleMouseEnterUser}
                      onMouseLeave={handleMouseLeaveUser}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="text-violet-500" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </>
            )}

            {user == null && (
              <button
                onClick={openModal}
                className="text-sm font-medium hover:text-yellow-400 transition-colors duration-200"
              >
                Đăng nhập/Đăng kí
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL LOGIN */}
      <Modal
        isOpen={modal.openLoginModal}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        className="w-[60%] h-[80vh] bg-white rounded-3xl shadow-lg overflow-hidden flex relative top-1/2 transform -translate-y-1/2 mx-auto"
      >
        <button
          onClick={closeModal}
          className="absolute top-3 left-3 text-2xl text-gray-500 hover:text-gray-700 z-10"
        >
          ✕
        </button>

        {/* Cột trái */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Người tìm việc
          </h2>
          <h3 className="text-2xl font-bold mb-4 text-center">
            Đăng nhập hoặc Đăng ký
          </h3>

          {!isShowInfor && (
            <form onSubmit={handleContinue}>
              <input
                type={loginWithMobile ? "tel" : "email"}
                placeholder={placeholderText}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-3 rounded mb-2"
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700">
                Tiếp tục
              </button>
            </form>
          )}

          {/* Modal nhập thông tin người dùng khi đăng nhập bằng sdt */}
          {isShowInfor && (
            <form onSubmit={handleCompleted}>
              <div className="mb-2">
                <label className="block mb-1 font-medium" htmlFor="fullName">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="w-full border border-gray-300 p-3 rounded"
                  onChange={handleInputName}
                />
                {errorName && (
                  <p className="text-red-500 text-sm mb-2">{errorName}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block mb-1 font-medium" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  onChange={handleInputPhoneChange}
                  type="tel"
                  value={loginWithMobile ? inputValue : undefined}
                  placeholder="Nhập số điện thoại"
                  disabled={loginWithMobile}
                  className={`w-full border border-gray-300 p-3 rounded ${
                    loginWithMobile ? "bg-gray-100 text-gray-500" : ""
                  }`}
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={!loginWithMobile ? inputValue : undefined}
                  disabled={!loginWithMobile}
                  className={`w-full border border-gray-300 p-3 rounded ${
                    !loginWithMobile ? "bg-gray-100 text-gray-500" : ""
                  }`}
                />
                {errorEmail && (
                  <p className="text-red-500 text-sm mb-2">{errorEmail}</p>
                )}
              </div>

              <button className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700">
                Hoàn tất
              </button>
            </form>
          )}

          {!isShowInfor && (
            <>
              <div className="text-center text-gray-400 my-2">Hoặc</div>

              <button
                onClick={handleLoginWithMethod}
                className="w-full border border-gray-300 p-3 rounded flex items-center gap-2 justify-center"
              >
                <img
                  src={loginWithMobile ? "/email.png" : "/phone.png"}
                  alt="icon"
                  className="w-5 h-5"
                />
                <span>
                  {loginWithMobile
                    ? "Đăng nhập bằng Email"
                    : "Đăng nhập bằng Số điện thoại"}
                </span>
              </button>
            </>
          )}
          {/* Phần chân */}
          <p className="text-xs text-gray-500 mt-4 leading-snug">
            Bằng việc đăng nhập, tôi đồng ý chia sẻ thông tin cá nhân của mình
            với nhà tuyển dụng theo các{" "}
            <a href="#" className="text-blue-600 underline" target="_blank">
              Điều khoản sử dụng
            </a>
            ,{" "}
            <a href="#" className="text-blue-600 underline" target="_blank">
              Chính sách bảo mật
            </a>{" "}
            và{" "}
            <a href="#" className="text-blue-600 underline" target="_blank">
              Chính sách dữ liệu cá nhân
            </a>
            .
          </p>
        </div>

        {/* Cột phải */}
        <div className="w-1/2 flex items-center justify-center p-4 bg-[#F4F4F4]">
          <img
            src="/banner-dangnhap.png"
            alt="Banner"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}

const JobOpportunityLink = ({
  item,
  handleMouseEnterJob,
  handleMouseLeaveJob,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickJobOpp = () => {
    dispatch({ type: "SET_SELECTED_INDUSTRY", payload: item });
    navigate("/job-opportunities");
  };

  return (
    <div
      onClick={handleClickJobOpp}
      onMouseEnter={handleMouseEnterJob}
      onMouseLeave={handleMouseLeaveJob}
      className="cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-violet-100 rounded-lg transition-all duration-300 hover:text-violet-700"
    >
      <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
      {item}
    </div>
  );
};
