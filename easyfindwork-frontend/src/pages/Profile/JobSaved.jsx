import React, { useEffect, useState } from 'react';
import JobRecomend from '../../components/JobItem';
import { useSelector } from 'react-redux';
import { getJobSave, getJobSaveByUserId } from '../../service/jobsave';

const JobSaved = () => {
  const user = useSelector((state) => state.user);

  // Example job listings array
  const [jobListings , setJobListings]= useState([]);

  const getData= async ()=>{
    const saved= await getJobSaveByUserId(user.id);
    setJobListings(saved);
    
  }
  getData(); 

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Việc làm đã lưu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobListings.map((job) => (
          <JobRecomend key={job.id} job={job}/>
        ))}
      </div>
    </div>
  );
};

export default JobSaved;
