import React, { useState, useCallback } from "react";
import ReactChatbotify from "react-chatbotify";
import axios from "axios";
import { JobCard } from "./JobCard";

export default function MyChatBot() {
  // State để lưu trữ danh sách công việc
  const [jobs, setJobs] = useState([]);

  // Hàm để inject tin nhắn chứa JobCard
  const injectJobCards = useCallback(async (injectMessage, jobsData) => {
    if (jobsData.length > 0) {
      console.log("Injecting job cards with data:", jobsData);
      await injectMessage(
        <div>
          <div className="font-semibold text-indigo-600 mb-2">
            Danh sách công việc phù hợp:
          </div>
          {jobsData.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>,
        "BOT"
      );
    } else {
      console.log("No jobs to inject");
      await injectMessage("Không có kết quả phù hợp.", "BOT");
    }
  }, []);

  return (
    <ReactChatbotify
      settings={{
        general: {
          embedded: false,
          showFooter: true,
          primaryColor: "#4f46e5",
        },
        chatHistory: {
          storageKey: "job_portal_chat",
        },
        tooltip: {
          text: "Tìm việc nhanh!",
          mode: "ALWAYS",
        },
        botBubble: {
          showAvatar: true,
          avatar: "https://cdn-icons-png.flaticon.com/512/8649/8649602.png",
        },
      }}
      flow={{
        start: {
          message:
            'Chào bạn! Hãy nhập tên công việc hoặc địa điểm bạn muốn tìm (ví dụ: "IT", "Hà Nội"):',
          path: "search_jobs",
        },
        search_jobs: {
          message: async ({ userInput, injectMessage }) => {
            try {
              // Lấy từ khóa từ userInput và đảm bảo là chuỗi
              const keyword = typeof userInput === "string" ? userInput : "";
              console.log("Searching with keyword:", keyword);

              // Gọi API để tìm kiếm công việc
              const response = await axios.post(
                "https://easyfindwork-chatbotserver.up.railway.app/api/chatbot/search-jobs",
                {
                  keyword,
                  userId: "guest",
                }
              );
              console.log("API response:", response.data);

              const { type, data } = response.data;

              // Cập nhật state jobs
              setJobs(data || []);

              // Inject tin nhắn chứa JobCard
              await injectJobCards(injectMessage, data || []);

              // Trả về chuỗi rỗng để tránh hiển thị tin nhắn trùng lặp
              return "";
            } catch (error) {
              console.error("Error:", error);
              setJobs([]); // Xóa danh sách nếu có lỗi
              await injectMessage(
                "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại!",
                "BOT"
              );
              return "";
            }
          },
          path: "search_jobs",
        },
      }}
      components={{
        // Tùy chỉnh hiển thị tin nhắn
        message: ({ message }) => {
          console.log("Message received:", message);
          // Chỉ hiển thị các tin nhắn chuỗi đơn giản
          return <div>{message || "Không thể hiển thị tin nhắn."}</div>;
        },
      }}
    />
  );
}
