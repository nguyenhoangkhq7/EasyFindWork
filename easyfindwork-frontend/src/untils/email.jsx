import emailjs from "@emailjs/browser";
export const sendOtpToEmail = (email, otp) => {
    const currentTime = new Date();
    const expireTime = new Date(currentTime.getTime() + 5 * 60000); // +15 phút
    const timeString = expireTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const templateParams = {
      passcode: otp,
      time: timeString,
      email: email,
    };

    emailjs
      .send(
        "service_sq59oz9",
        "template_hoz8l46",
        templateParams,
        "4uQ6aucAqBeA9wf1u"
      )
      .then((response) => {
        console.log("Email sent!", response.status, response.text);
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Lỗi khi gửi email!",
          footer: "Kiểm tra lại email của bạn",
        });
      });
  };