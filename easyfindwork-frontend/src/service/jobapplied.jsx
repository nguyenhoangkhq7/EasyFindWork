export const getJobAppliedByUserIdAndJobId = async (userId, jobId) => {
  if (!userId || !jobId) return null;

  try {
    const res = await fetch("http://localhost:3000/applications");
    const data = await res.json();
    const jobList = data.filter(x => x.userId == userId);
    const job = jobList.find((x) => x.jobId === jobId);
    return job|| null;
  } catch (error) {
    console.error("Lỗi khi lấy job đã nộp:", error);
    return null;
  }
};