// src/components/JobCard.jsx
import { Link } from "react-router-dom";
import { useChatWindow } from "react-chatbotify";
import { Briefcase, MapPin, Building2, Coins } from "lucide-react";

export function JobCard({ job }) {
  const { toggleChatWindow } = useChatWindow();

  const handleClick = () => {
    toggleChatWindow(false); // Đóng chatbot khi nhấn
  };

  return (
    <Link
      to={`/job/${job.id}`}
      onClick={handleClick}
      className="block p-5 border border-gray-200 rounded-2xl shadow-sm bg-white hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 ease-in-out hover:shadow-md"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-lg text-gray-800 truncate">
            {job.title}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{job.location || "Không xác định"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Building2 className="w-4 h-4" />
          <span>{job.company || "Công ty ẩn danh"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
          <Coins className="w-4 h-4" />
          <span>{job.salary || "Thỏa thuận"}</span>
        </div>
      </div>
    </Link>
  );
}
