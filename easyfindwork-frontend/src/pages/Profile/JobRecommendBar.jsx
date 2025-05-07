import {  useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import JobItem from "../../components/JobItem";
import { getJobSaveByUserId } from "../../service/jobsave";

const JobRecommendBar = () => {
  const user = useSelector((state) => state.user);
  const [jobsRecommend, setJobsRecommend] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedJobs = async () => {
    if (!user?.location) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/jobs");
      const jobs = await response.json();
      const filtered = jobs.filter(
        (job) => job.location === user.location && job.isActive
      );
      const likedJobs= (await getJobSaveByUserId(user.id)).map(x=>x.id) ||[];
      const sortedJobs = filtered.sort((a, b) => {
        const aLiked = likedJobs.includes(a.id); 
        const bLiked = likedJobs.includes(b.id); 
      
        if (aLiked && !bLiked) return -1;
        if (!aLiked && bLiked) return 1;
      
        return 0;
      });
      console.log(sortedJobs);


      setJobsRecommend(sortedJobs);
    } catch (error) {
      console.error("Lỗi khi tải công việc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedJobs();
  }, [user.location, user.id]);

  return (
    <div className="w-full md:w-96 p-6">
      <h2 className="text-xl font-bold mb-4">Việc làm gợi ý cho bạn</h2>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">Đang tải công việc...</p>
        ) : jobsRecommend.length > 0 ? (
          jobsRecommend.map((job) => (
            <JobItem key={job.id} job={job}/>
          ))
        ) : (
          <p className="text-gray-500">Không có công việc gợi ý.</p>
        )}
      </div>
    </div>
  );
};

export default JobRecommendBar;
