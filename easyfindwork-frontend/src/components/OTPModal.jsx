import { useState, useRef, useEffect } from "react"
import { FaTimes, FaShieldAlt, FaUser } from "react-icons/fa"
import { IoIosArrowBack } from "react-icons/io";

export default function OTPModal({ isOpen, onClose, email , otpCode,sentParent, onBack}) {
  const [timer, setTimer] = useState({ minutes: 4, seconds: 49 });
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const modalRef = useRef(null);
  const [erOtp,setErOtp]= useState();
  const [hasExpired, setHasExpired] = useState(false);

  // Reset OTP when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", ""])
      setTimer({ minutes: 4, seconds: 49 })
      setErOtp("");
    }
  }, [isOpen])

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto focus next input
      if (value !== "" && index < 3) {
        inputRefs[index + 1].current.focus()
      }
    }
    setErOtp("");
  }

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("")

    const newOtp = [...otp]
    pastedData.forEach((value, index) => {
      if (index < 4) {
        newOtp[index] = value
      }
    })
    setErOtp("");
    setOtp(newOtp)

    // Focus last filled input or first input
    const lastIndex = Math.min(pastedData.length - 1, 3)
    if (lastIndex >= 0) {
      inputRefs[lastIndex].current.focus()
    }
  }

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer.seconds > 0) {
          return { ...prevTimer, seconds: prevTimer.seconds - 1 }
        } else if (prevTimer.minutes > 0) {
          return { minutes: prevTimer.minutes - 1, seconds: 59 }
        } else {
          clearInterval(interval)
          return { minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0 && !hasExpired) {
      setErOtp("Mã OTP đã hết hạn, vui lòng yêu cầu lại.");
      setHasExpired(true);
      sentParent("-1000");
    }
  }, [timer, hasExpired]);
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", ""]);
      setTimer({ minutes: 4, seconds: 49 });
      setErOtp("");
      setHasExpired(false); // Reset khi mở lại modal
    }
  }, [isOpen]);

  // Format timer display
  const formatTime = () => {
    const minutes = timer.minutes.toString().padStart(2, "0")
    const seconds = timer.seconds.toString().padStart(2, "0")
    return `${minutes}:${seconds}`
  }

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs[0].current) {
      setTimeout(() => {
        inputRefs[0].current.focus()
      }, 100)
    }
  }, [isOpen])

  
  useEffect(()=>{
    if (timer.minutes === 0 && timer.seconds === 0) {
      setErOtp("Mã OTP đã hết hạn, vui lòng yêu cầu lại.");
    }
      const isComplete= otp.every((digit)=> digit!="");
      if(isComplete){
          const enterOTP= otp.join("");
          if(otpCode==enterOTP)
            sentParent(enterOTP);
          else{
            setErOtp("Mã OTP sai, nhập lại");
            setOtp(["", "", "", ""]); // Xóa ô nhập
            setTimeout(() => {
              inputRefs[0].current.focus(); // Focus lại ô đầu tiên
            }, 100);
                }
              }
    }, [otp])
    
    if (!isOpen) return null
  

  return (
    <div
      className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
    >
      <div ref={modalRef} className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl flex overflow-hidden">

        {/* Close button */}
        <button
          className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 z-10"
          onClick={onBack}
          aria-label="Close modal"
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Xác thực OTP</h2>

          <p className="text-gray-600 text-center mb-2">Vui lòng nhập mã OTP mà chúng tôi đã gửi đến</p>

          <p className="text-center font-semibold mb-1">{email}</p>

          <p className="text-gray-500 text-center text-sm mb-6">
            mã bạn đã đăng ký. Kiểm tra hộp thư Spam nếu không thấy mail.
          </p>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 border-2 border-gray-300 rounded text-center text-xl font-bold focus:border-blue-500 focus:outline-none"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          {erOtp && <p className="text-red-500 text-sm mb-2 text-center">{erOtp}</p>}

          {/* Timer */}
          <div className="text-center">
            <p className="text-gray-600">
              Mã OTP hết hạn trong: <span className="text-red-500 font-medium">{formatTime()}s</span>
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-50 to-purple-100">
          <div className="h-full flex items-center justify-center p-6">
            <div className="relative">
              {/* Phone illustration */}
              <div className="w-48 h-80 bg-blue-100 rounded-3xl border-4 border-white shadow-lg relative flex flex-col items-center justify-center">
                <div className="absolute top-8 w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
                  <FaUser className="text-purple-400 w-10 h-10" />
                </div>

                <div className="w-32 h-4 bg-purple-300 rounded-full mt-24 mb-2"></div>
                <div className="w-32 h-4 bg-purple-300 rounded-full mb-6"></div>

                <div className="flex gap-1 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-purple-300"></div>
                  ))}
                </div>

                <div className="w-24 h-8 bg-pink-300 rounded-full"></div>
              </div>

              {/* Shield icon */}
              <div className="absolute -bottom-4 -left-10 w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center">
                <FaShieldAlt className="text-blue-400 w-10 h-10" />
              </div>

              {/* Person illustration */}
              <div className="absolute -right-24 bottom-0">
                <div className="w-24 h-24 relative">
                  <div className="w-12 h-12 bg-blue-200 rounded-full absolute top-0 left-2"></div>
                  <div className="w-20 h-16 bg-white absolute top-8 left-0"></div>
                  <div className="w-6 h-12 bg-blue-200 absolute bottom-0 left-4"></div>
                  <div className="w-6 h-12 bg-blue-200 absolute bottom-0 right-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
