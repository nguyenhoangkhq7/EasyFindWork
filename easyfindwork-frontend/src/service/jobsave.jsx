import { getJobById } from "./job";

export const  getJobSave=async ()=>{
    const res= await fetch("http://localhost:3000/savedJobs");
    const dataa= await res.json();
    return dataa;
}
export const getJobSaveByUserId = async (id) => {
    const res = await fetch("http://localhost:3000/savedJobs");
    const data = await res.json();
    const newData = data.filter(x => x.userId === id);

    if (newData.length > 0) {
        const jobsWithDetails = await Promise.all(newData.map(async (item) => {
            const job = await getJobById(item.jobId);
            return job;
        }));
        return jobsWithDetails;
    }

    return [];
};

export const getJobSavedByUserAndJob = async (userId, jobId) => {
    if (!userId || !jobId) return null;
    const res= await fetch("http://localhost:3000/savedJobs");
    const data= await res.json();
    const jobList= data.filter(x=>x.userId== userId)
  
    try {
      const job = jobList.find((x) => x.jobId === jobId);
      return job || null;
    } catch (error) {
      console.error("Lỗi khi lấy job đã lưu:", error);
      return null;
    }
  };

export const addJobSaved = async (jobSaved) => {
    const response = await fetch("http://localhost:3000/savedJobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobSaved),
    });

  
    if (!response.ok) {
      throw new Error("Không thể thêm người dùng mới");
    }};

export const deleteJobSaved = async (jobSavedId) => {
    const response = await fetch(`http://localhost:3000/savedJobs/${jobSavedId}`, {
        method: "DELETE",
    });
    
    if (!response.ok) {
        throw new Error("Không thể xóa job đã lưu");
    }
    };