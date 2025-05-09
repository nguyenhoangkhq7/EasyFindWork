import React from "react";
import Modal from "react-modal";
import { FaClock, FaTimes, FaExclamationCircle } from "react-icons/fa";
export function StatusJobModal({
  isOpen,
  onClose,
  title = "Trạng thái công việc",
  companyName,
  jobApplied,
  jobTitle,
  salary
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
    //   className="modal-content"
      overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"

      className="outline-none"
      ariaHideApp={false}
    >
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <h2 className="text-center text-lg font-semibold mb-4">{title}</h2>

        <div className="border-b pb-4 space-y-2 text-sm">
          {jobTitle && (
            <div className="flex justify-between">
              <span className="font-medium">Tên công việc:</span>
              <span className="font-semibold">{jobTitle}</span>
            </div>
          )}
          {companyName && (
            <div className="flex justify-between">
              <span className="font-medium">Công ty:</span>
              <span>{companyName}</span>
            </div>
          )}
          {jobApplied && (
            <>
            <div className="flex justify-between">
                <span className="font-medium">Ngày apply:</span>
                <span>{new Date(jobApplied.appliedDate).toLocaleDateString("en-GB")}</span>
            </div>
            </>
            )}

            {salary &&(
                <div className="flex justify-between">
                    <span className="font-medium">Mức lương:</span>
                    <span className="text-green-600 font-medium">{salary}</span>
                </div>
            )}
        </div>

        <div className="flex flex-col items-center p-6 text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
            <FaClock className="w-8 h-8 text-yellow-500" />
          </div>

          <h3 className="text-lg font-medium">{jobApplied ? jobApplied.status : " "}</h3>

          {jobApplied && jobApplied.reason ? (
            <div className="w-full mt-4">
              <div className="flex items-start gap-2 p-4 rounded-lg bg-gray-100">
                <FaExclamationCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-medium mb-1">Lí do:</h4>
                  <p className="text-sm text-gray-600">{reason}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Công việc của bạn đang chờ được phản hồi. Chúng tôi sẽ thông báo khi có cập nhật.
            </p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
