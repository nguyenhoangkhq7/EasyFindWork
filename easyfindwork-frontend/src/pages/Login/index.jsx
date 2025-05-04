import React, { useState } from "react";
import Modal from "react-modal";
import { addUser, getUserWithMobilePhoneOrEmail } from "../../service/user";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [placeholderText, setPlaceholderText] = useState("Nhập Số điện thoại");
  const [loginWithMobile, setLoginMobile] = useState(true);
  const [modalIsOpen, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isShowInfor, setShowInfor] = useState(false);

  const [errorName, setErrorName]= useState();
  const [errorEmail, setErrorEmail]= useState();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const openModal = () => {
    reload();
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
    reload();
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

  const handleInputName= (e)=>{
    setErrorName("");
  }



  const handleContinue = async (e) => {
    e.preventDefault();
    if (loginWithMobile) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(inputValue)) {
        setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
        return;
      }
      const user = await getUserWithMobilePhoneOrEmail(inputValue);
      console.log(user);
      if (user == null) {
        setShowInfor(true);
        return;
      }
      if (user != null) {
        dispatch({
          type: "LOGIN",
          user: user,
        });
      }
    }
    else{
      
    }
  };

  const handleCompleted= (e)=>{
    e.preventDefault();
    const fullName= e.target.elements.fullName.value.trim();
    const email= e.target.elements.email.value.trim();
    const phone= e.target.elements.phone.value.trim();
    const nameRegex = /^([A-Za-zÀ-ỹà-ỹ]+)(\s[A-Za-zÀ-ỹà-ỹ]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!nameRegex.test(fullName)){
      setErrorName("Tên không chứa số và kí tự đặc biệt.");
      return;
    }
    if(!emailRegex.test(email)){
      setErrorEmail("Chưa đúng định dạng email.");
      return;
    }
    const user= {fullName, email, phone}
    try {
      const result= addUser(user);
      dispatch({
        type:"LOGIN",
        user: user
      })
      console.log(user);

    } catch (error) {
      console.error("Errol add user");
      
    }
    // đăng nhập thành cong chuyển trang tài khoản

  }

  const reload= ()=>{
    setError("");
    setErrorEmail("");
    setErrorName("");
    setLoginMobile(true);
    setShowInfor(false);
  }
  // console.log("dang nhap: ", user);

  return (
    <>
      <div className="w-full flex justify-center items-center bg-gray-100">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Modal
        </button>

        <Modal
          isOpen={modalIsOpen}
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
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded mb-2"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button
                  className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700"
                >
                  Tiếp tục
                </button>
              </form>
            )}


{/* modal nhập thông tin người dùng khi dăng nhập bằng sdt */}
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
                  {errorName && <p className="text-red-500 text-sm mb-2">{errorName}</p>}
                </div>

                <div className="mb-2">
                  <label className="block mb-1 font-medium" htmlFor="phone">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={inputValue}
                    disabled
                    className="w-full border border-gray-300 p-3 rounded bg-gray-100 text-gray-500"
                  />
                  
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="w-full border border-gray-300 p-3 rounded"
                  />
                   {errorEmail && <p className="text-red-500 text-sm mb-2">{errorEmail}</p>}
                </div>
                <button
                  className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700"
                >
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
                    src={
                      loginWithMobile
                        ? "../../../public/email.png"
                        : "../../../public/phone.png"
                    }
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
          {/* phần chân */}
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
              src="../../../public/banner-dangnhap.png"
              alt="Banner"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Login;
