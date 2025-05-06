import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addJobSaved, deleteJobSaved, getJobSavedByUserAndJob } from "../service/jobsave";
import { Link } from "react-router-dom";

const JobRecomend = ({ job }) => {
  const user= useSelector(state=>state.user);
  const [company, setCompany] = useState();
  const [liked, setLiked] = useState(false);
  const [savedJobId, setSavedJobId] = useState(null); // để lưu id khi cần xóa

  useEffect(() => {
    fetch("http://localhost:3000/companies")
      .then((res) => res.json())
      .then((data) => data.find((item) => item.id == job.companyId))
      .then((x) => setCompany(x));
  }, [job.companyId]);

  useEffect(() => {
    const checkJobSaved = async () => {
      if (!user?.id) return;
      try {
        // console.log(user.id, job.id);
        const saved = await getJobSavedByUserAndJob(user.id, job.id);
        // console.log(saved);
        if (saved) { 
          setLiked(true);
          setSavedJobId(saved.id); // lưu lại ID để xoá sau
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra job đã lưu:", error);
      }
    };
  
    checkJobSaved();
  }, [user.id, job.id]);


  const handleHeartClick =  async() => {
  try {
    if (!liked) {
      // Thêm mới
      const jobSaved = {
        userId: user.id,
        jobId: job.id,
        savedAt: new Date().toISOString(),
      };
      await addJobSaved(jobSaved);
      // console.log("job", jobSaved);
      
      setLiked(true);
    } else {
      // Đã lưu → Xoá
      if (savedJobId) {
        await deleteJobSaved(savedJobId);
        // console.log("đã xóa: ", savedJobId);
        setLiked(false);
        setSavedJobId(null);
      }
    }
  } catch (error) {
    console.error("Lỗi khi xử lý like/unlike:", error);
  }
};

  return (
    <div className="bg-white rounded-md shadow-sm p-4 relative hover:bg-gray-50 hover:shadow-lg transition-all duration-200">
      <div className="absolute top-2 right-2">
        <Heart
          className={`h-5 w-5 ${liked ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 cursor-pointer`}
          onClick={handleHeartClick}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center overflow-hidden">
            <img
              src={company ? company.logo : "/placeholder.svg?height=48&width=48"}
              alt="Company logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
        <Link to={`/job/${job.id}`}>
          <h3 className="font-medium text-xl mb-1 hover:text-blue-600">
            {job.title ? job.title : "Job Title"}
          </h3>
        </Link>
          <p className="text-sm text-gray-600 mb-2">{company ? company.name : "Company Name"}</p>

          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <img src="../../../public/money.png" alt="" className="mr-1 w-4 h-4" />
              <span>
                {job.salaryMin && job.salaryMax
                  ? `${(job.salaryMin / 1_000_000).toLocaleString('vi-VN')} - ${(job.salaryMax / 1_000_000).toLocaleString('vi-VN')} triệu`
                  : "Mức lương"}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <img src="../../../public/location.png" alt="" className="mr-1 w-4 h-4" />
              <span>{job.location ? job.location : "Location"}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <img src="../../../public/time.png" alt="" className="mr-1 w-4 h-4" />
            <span>{job.deadline ? `Còn ${calculateDaysLeft(job.deadline)} ngày` : "Deadline info"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate the remaining days until the deadline
const calculateDaysLeft = (deadline) => {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  const diffTime = deadlineDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default JobRecomend;
