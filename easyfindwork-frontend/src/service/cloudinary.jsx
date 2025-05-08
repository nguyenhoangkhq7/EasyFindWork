import axios from "axios";
import CryptoJS from "crypto-js";
export async function uploadFileByUrl(file, type = "raw") {
  if (!file) return;

  if (type === "raw") {
    if (file.size > 5 * 1024 * 1024) {
      console;
      return;
    }

    // kiểm tra định dạng file
    // Chỉ cho phép các định dạng .pdf, .doc, .docx
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      console.error("Định dạng file không hợp lệ:", file.type);
      return;
    }
  } else {
    if (file.size > 2 * 1024 * 1024) {
      console.error("Kích thước file vượt quá 2MB:", file.size);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      console.error("Định dạng file không hợp lệ:", file.type);
      return;
    }
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "easyfindwork_upload");
  // Tự động chọn folder phù hợp
  // const folder = type === "image" ? "avatar" : "cv_file";
  const folder = "cv_file";
  formData.append("folder", folder);

  // Tự động chọn endpoint đúng
  const endpoint = `https://api.cloudinary.com/v1_1/dzcodbajo/${type}/upload`;

  try {
    const response = await axios.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response; // Trả về data đã upload (secure_url, public_id,...)
  } catch (error) {
    console.error("Upload failed:", error.response || error);
    throw new Error("Lỗi khi tải lên, vui lòng thử lại.");
  }
}

// Hàm tạo signature cho Cloudinary
const generateSignature = (publicId, apiSecret) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const stringToSign = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = CryptoJS.SHA1(stringToSign).toString(CryptoJS.enc.Hex);
  return { signature, timestamp };
};

export async function deleteFileByUrl(fileUrl, type = "raw") {
  try {
    const urlParts = fileUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1 || uploadIndex >= urlParts.length - 2) {
      throw new Error("Invalid fileUrl format");
    }

    // Lấy public_id đúng định dạng
    const publicId =
      type === "raw"
        ? urlParts.slice(uploadIndex + 2).join("/")
        : urlParts
            .slice(uploadIndex + 2)
            .join("/")
            .replace(/\.[^/.]+$/, ""); // Loại bỏ phần mở rộng .jpg, .png, .pdf

    const cloudName = "dzcodbajo";
    const apiKey = "918951827913432";
    const apiSecret = "7PKhoIRkSwR-8CvL14cTtNIuhoY";

    const { signature, timestamp } = generateSignature(publicId, apiSecret);

    const response = await axios.post(
      type === "image"
        ? `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
        : `https://api.cloudinary.com/v1_1/${cloudName}/raw/destroy`,
      {
        public_id: publicId,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature,
        invalidate: true,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.result !== "ok") {
      throw new Error("Xóa không thành công: " + response.data.result);
    }

    return true;
  } catch (error) {
    console.error(
      "Error deleting CV:",
      error.response?.data,
      error.message,
      error
    );
  }
}
