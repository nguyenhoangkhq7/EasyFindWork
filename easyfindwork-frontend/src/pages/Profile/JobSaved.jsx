import React from 'react';
import JobRecomend from '../../components/JobRecomend';
import { useSelector } from 'react-redux';

const JobSaved = () => {
  const user = useSelector((state) => state.user);

  // Example job listings array
  const jobListings = [
    {
      id: 'job_001',
      title: 'Nhân Viên Kinh Doanh Thiết Bị Đo Lường',
      companyId: 'company_001',
      location: 'TP.HCM',
      salaryMin: 5000000,
      salaryMax: 15000000,
      quantity: 2,
      postedDate: '2025-04-21T10:00:00Z',
      deadline: '2025-05-08T23:59:59Z',
      description: 'Tìm kiếm khách hàng và phát triển kinh doanh thiết bị đo lường (PLC, HMI, Servo)...',
      requirements: 'Tốt nghiệp trung cấp trở lên, ưu tiên kinh nghiệm bán hàng.',
      benefits: 'Lương cứng + hoa hồng + thưởng, BHXH đầy đủ.',
      industry: 'Kinh doanh, Kỹ thuật',
      skillsRequired: ['Giao tiếp', 'Đàm phán'],
      isActive: true,
      views: 120,
      applicants: ['user_001'],
    },
    {
      id: 'job_002',
      title: 'Nhân Viên Kinh Doanh Thiết Bị Điện Tử',
      companyId: 'company_002',
      location: 'Hà Nội',
      salaryMin: 6000000,
      salaryMax: 18000000,
      quantity: 3,
      postedDate: '2025-04-15T10:00:00Z',
      deadline: '2025-05-10T23:59:59Z',
      description: 'Tìm kiếm khách hàng và phát triển kinh doanh thiết bị điện tử, hệ thống điện... ',
      requirements: 'Tốt nghiệp cao đẳng trở lên, kinh nghiệm bán hàng ít nhất 1 năm.',
      benefits: 'Lương cơ bản + thưởng doanh số, BHXH đầy đủ.',
      industry: 'Kinh doanh, Điện tử',
      skillsRequired: ['Giao tiếp', 'Kỹ năng thuyết phục'],
      isActive: true,
      views: 150,
      applicants: ['user_002'],
    },
    {
        id: 'job_003',
        title: 'Nhân Viên Kinh Doanh Thiết Bị Điện Tử',
        companyId: 'company_002',
        location: 'Hà Nội',
        salaryMin: 6000000,
        salaryMax: 18000000,
        quantity: 3,
        postedDate: '2025-04-15T10:00:00Z',
        deadline: '2025-05-10T23:59:59Z',
        description: 'Tìm kiếm khách hàng và phát triển kinh doanh thiết bị điện tử, hệ thống điện... ',
        requirements: 'Tốt nghiệp cao đẳng trở lên, kinh nghiệm bán hàng ít nhất 1 năm.',
        benefits: 'Lương cơ bản + thưởng doanh số, BHXH đầy đủ.',
        industry: 'Kinh doanh, Điện tử',
        skillsRequired: ['Giao tiếp', 'Kỹ năng thuyết phục'],
        isActive: true,
        views: 150,
        applicants: ['user_003 '],
      }
    // More job listings here
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Việc làm đã lưu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobListings.map((job) => (
          <JobRecomend key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobSaved;
