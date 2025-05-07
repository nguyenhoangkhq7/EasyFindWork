import React, { useEffect, useState } from 'react';
import JobItem from '../../components/JobItem';
import { useSelector } from 'react-redux';
import { getJobSaveByUserId } from '../../service/jobsave';

const JobSaved = () => {
  const user = useSelector((state) => state.user);
  const [jobListings, setJobListings] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const saved = await getJobSaveByUserId(user.id);
        setJobListings(saved);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách việc làm đã lưu:", error);
        setJobListings([]);
      }
    };

    if (user?.id) {
      getData();
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Việc làm đã lưu
      </h1>

      {jobListings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">Không có việc làm đã lưu.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobListings.map((job) => (
            <JobItem key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSaved;
