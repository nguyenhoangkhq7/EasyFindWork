import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addJobSaved, deleteJobSaved, getJobSavedByUserAndJob } from "../service/jobsave";
import { Link } from "react-router-dom";
import { getJobAppliedByUserIdAndJobId } from "../service/jobapplied";
import { StatusJobModal } from "./StatusJobModal";

const JobApplied = ({ job ,company}) => {
  const user= useSelector(state=>state.user);
  const [liked, setLiked] = useState(false);
  const [savedJob, setSavedJob] = useState(null); 
  const [jobApplied, setJobApplied]= useState(null);
  const [isOpenModal, setOpenModal]= useState(false);

  useEffect(() => {
    const checkJobSaved = async () => {
      if (!user?.id) return;
      try {
        // console.log(user.id, job.id);
        const saved = await getJobSavedByUserAndJob(user.id, job.id);
        // console.log(saved);
        if (saved) { 
          setLiked(true);
          setSavedJob(saved);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra job đã lưu:", error);
      }
    };
  
    checkJobSaved();
  }, [user.id, job.id]);

  useEffect(()=>{
    const fetchJobApplied= async()=>{
        const jobApp=await getJobAppliedByUserIdAndJobId(user.id, job.id);
        if(jobApp){
            setJobApplied(jobApp);
        }
    }
    fetchJobApplied();
    console.log(jobApplied);
    
  }, [])

  const handleHeartClick =  async() => {
  try {
    if (!liked) {
      // Thêm mới
      const jobSaved = {
        userId: user.id,
        jobId: job.id,
        savedAt: new Date().toISOString(),
      };
      const jobResult=  await addJobSaved(jobSaved);

      setSavedJob(jobResult);
      setLiked(true);
    } else {
      // Đã lưu → Xoá
      if (savedJob) {
        console.log("xoas", savedJob);
        
        await deleteJobSaved(savedJob.id);
        // console.log("đã xóa: ", savedJob);
        setLiked(false);
        setSavedJob(null);
      }
    }
   
  } catch (error) {
    console.error("Lỗi khi xử lý like/unlike:", error);
  }
};
    const closeModal= ()=>{
        setOpenModal(false);
    }


    const  hanldeClickStatus= ()=>{
        setOpenModal(true);
        console.log("done");
    }
    const formattedSalary = job.salaryMin && job.salaryMax? `${(job.salaryMin).toLocaleString('vi-VN')} - ${(job.salaryMax).toLocaleString('vi-VN')} VND`: "Mức lương";
  return (
    <>
    <StatusJobModal isOpen={isOpenModal} onClose={closeModal} jobApplied= {jobApplied} companyName={company.name} jobTitle={job.title} salary={formattedSalary}/>
    <div className="bg-white border-2 border-gray-200 rounded-md p-5 relative hover:shadow-xl hover:border-blue-300 transition-all duration-300 ease-in-out group">
    <div className="absolute top-3 right-3">
      <Heart
        className={`h-5 w-5 transition-colors duration-200 ${liked ? 'text-red-500' : 'text-gray-300'} group-hover: cursor-pointer`}
        onClick={handleHeartClick}
      />
    </div>

  {/* Nội dung job */}
  <div className="flex gap-4">
    {/* Logo công ty */}
    <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-gray-100">
      <img
        src={company ? company.logo : "/placeholder.svg?height=56&width=56"}
        alt="Company logo"
        className="object-contain w-full h-full"
      />
    </div>

    {/* Nội dung chính */}
    <div className="flex-1">
      <Link to={`/job/${job.id}`}>
        <h3 className="text-base font-semibold text-gray-800 hover:text-blue-600 line-clamp-1 transition-colors duration-200">
          {job.title || "Job Title"}
        </h3>
      </Link>
      <p className="text-sm text-gray-500 truncate mb-1">
        {company ? company.name : "Company Name"}
      </p>

      {/* Lương + địa điểm */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <img src="/money.png" alt="salary" className="w-4 h-4" />
          <span>
            {job.salaryMin && job.salaryMax
              ? `${(job.salaryMin / 1_000_000).toLocaleString('vi-VN')} - ${(job.salaryMax / 1_000_000).toLocaleString('vi-VN')} triệu`
              : "Mức lương"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/location.png" alt="location" className="w-4 h-4" />
          <span>{job.location || "Location"}</span>
        </div>
      </div>

      {/* Thời hạn */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
            <img src="/time.png" alt="deadline" className="w-4 h-4" />
            <span>
            {job.deadline ? 
                new Date(job.deadline) < new Date() 
                ? "Hết hạn" 
                : `Còn ${calculateDaysLeft(job.deadline)} ngày` 
                : "Deadline info"}
            </span>
        </div>
        <div className="flex gap-1">
        { jobApplied&& (() => {
            switch (jobApplied.status) {
            case "Đang xử lý":
                return (
                <button onClick={hanldeClickStatus} className="bg-yellow-200 p-1 pl-2 pr-2 rounded-2xl text-[12px] hover:bg-yellow-300 hover:text-black transition duration-200">
                    Đang xử lý
                </button>
                );
            case "đã phê duyệt":
                return (
                <button onClick={hanldeClickStatus} className="bg-green-200 p-1 pl-2 pr-2 rounded-2xl text-[12px] hover:bg-green-300 hover:text-black transition duration-200">
                    Đã phê duyệt
                </button>
                );
            case "bị từ chối":
                return (
                <button onClick={hanldeClickStatus} className="bg-red-200 p-1 pl-2 pr-2 rounded-2xl text-[12px] hover:bg-red-300 hover:text-black transition duration-200">
                    Bị từ chối
                </button>
                );
            default:
                return null;
            }
        })()}
        </div>
      </div>
    </div>
  </div>
</div>
    </>


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

export default JobApplied;
