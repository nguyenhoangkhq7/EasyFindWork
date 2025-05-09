import JobSaved from "../Profile/JobSaved";
import React, { useEffect, useState } from 'react';
import JobItem from '../../components/JobItem';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { getAllJobByIndustry } from "../../service/job";

const JobOpportunity= ()=>{
    const user= useSelector(state=> state.user);
    const jobIdus= useSelector(state=> state.jobIndusOpp);
    const [jobListings, setJobListings]= useState([]);
    const getJobListings= async()=>{
        if(jobIdus){
            const currentDate= new Date();
            const data= await getAllJobByIndustry(jobIdus);
            const filteredData= data.filter(x=> new Date(x.deadline) >= currentDate);
            setJobListings(filteredData);
        }
        
    }
    useEffect(()=>{
        getJobListings();
    }, [jobIdus])
    

    console.log(jobListings);
    

    return (<>
        {!user && (
          <>
          <p className="text-gray-500 text-center">Vui lòng đăng nhập để sử dụng tính năng này</p>
          <div className="h-[50vh]"></div>
          </>
        )}
        {jobIdus && user && (
            <motion.div className=""
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="min-h-screen bg-gray-100 flex-1 p-6 space-y-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-1 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 2 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="2" height="24" />
                </svg>
                {jobIdus}
              </h1>
    
              {jobListings.length === 0 ? (
                <p className="text-center text-gray-600 text-lg mt-10">Hiện chưa có việc công việc trong ngành này.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobListings.map((job) => (
                    <JobItem key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
        </motion.div>
        )}
    </>);
}
export default JobOpportunity;