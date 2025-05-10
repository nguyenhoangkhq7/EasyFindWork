"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBot from "react-chatbotify";
import {
  FiSearch,
  FiMapPin,
  FiChevronRight,
  FiHeart,
  FiBriefcase,
  FiClock,
  FiFilter,
  FiDollarSign,
  FiBookOpen,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";
import {
  Input,
  Select,
  Button,
  Card,
  Skeleton,
  Row,
  Col,
  Badge,
  Tooltip,
  Tag,
  message,
} from "antd";
import { provinces } from "vietnam-provinces";
import { useSelector } from "react-redux"; // Thêm để lấy user từ Redux
import MyChatBot from "./MyChatBot";

const { Option } = Select;

export default function JobSearch() {
  const user = useSelector((state) => state.user); // Lấy thông tin user từ Redux

  // Hàm chọn ngẫu nhiên tối đa n công việc
  const getRandomJobs = useCallback((jobs, n) => {
    if (!jobs || jobs.length === 0) return [];
    const shuffled = [...jobs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, jobs.length));
  }, []);

  // State
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]); // Danh sách ngành nghề động
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Trong JobSearch component, thêm state để lưu tổng số việc làm
  const [totalJobs, setTotalJobs] = useState(0);

  // Tính tổng số việc làm khi jobs thay đổi
  useEffect(() => {
    const total = jobs.reduce((sum, job) => sum + (job.quantity || 0), 0);
    setTotalJobs(total);
  }, [jobs]);
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get("searchQuery")
      ? decodeURIComponent(queryParams.get("searchQuery"))
      : ""
  );
  const [filterIndustry, setFilterIndustry] = useState(
    queryParams.get("filterIndustry")
      ? decodeURIComponent(queryParams.get("filterIndustry"))
      : ""
  );
  const [filterLocation, setFilterLocation] = useState(
    queryParams.get("filterLocation") || ""
  );
  const [filterExperience, setFilterExperience] = useState("");
  const [filterSalary, setFilterSalary] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [experienceOptions, setExperienceOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showAllIndustries, setShowAllIndustries] = useState(false);

  const visibleIndustries = showAllIndustries
    ? industries
    : industries.slice(0, 5); // Hiện 5 cái đầu tiên
  const [showAllProvinces, setShowAllProvinces] = useState(false);
  const visibleProvinces = showAllProvinces
    ? provinceOptions
    : provinceOptions.slice(0, 6); // Hiện 6 cái đầu
  const normalizeIndustry = useCallback((industry) => {
    if (!industry) return industry;
    return industry.split(" - ")[0].trim();
  }, []);

  const suggestedJobs = useMemo(
    () => getRandomJobs(jobs, 9),
    [jobs, getRandomJobs]
  );
  const jobsPerPage = 9;

  // Danh sách mức lương
  const salaryOptions = [
    { label: "Tất cả mức lương", value: "", range: null },
    {
      label: "1 - 3 triệu",
      value: "1000000-3000000",
      range: { min: 1000000, max: 3000000 },
    },
    {
      label: "3 - 5 triệu",
      value: "3000000-5000000",
      range: { min: 3000000, max: 5000000 },
    },
    {
      label: "5 - 7 triệu",
      value: "5000000-7000000",
      range: { min: 5000000, max: 7000000 },
    },
    {
      label: "7 - 10 triệu",
      value: "7000000-10000000",
      range: { min: 7000000, max: 10000000 },
    },
    {
      label: "10 - 15 triệu",
      value: "10000000-15000000",
      range: { min: 10000000, max: 15000000 },
    },
    {
      label: "15 - 20 triệu",
      value: "15000000-20000000",
      range: { min: 15000000, max: 20000000 },
    },
    {
      label: "20 - 30 triệu",
      value: "20000000-30000000",
      range: { min: 20000000, max: 30000000 },
    },
    {
      label: "30 - 40 triệu",
      value: "30000000-40000000",
      range: { min: 30000000, max: 40000000 },
    },
    {
      label: "Trên 40 triệu",
      value: "40000000+",
      range: { min: 40000000, max: Infinity },
    },
    { label: "Thỏa thuận", value: "Thỏa thuận", range: null },
  ];

  // Hàm chuẩn hóa tên tỉnh thành
  const normalizeProvinceName = useCallback((name) => {
    if (!name) return name;
    const normalized = name.trim();
    switch (normalized) {
      case "Thành phố Hồ Chí Minh":
      case "Ho Chi Minh City":
        return "TP.HCM";
      case "Hà Nội":
      case "Ha Noi":
      case "Hanoi":
      case "Thành phố Hà Nội":
        return "Ha Noi";
      case "Cần Thơ":
      case "Can Tho":
      case "Thành phố Cần Thơ":
        return "Can Tho";
      case "Đà Nẵng":
      case "Da Nang":
      case "Thành phố Đà Nẵng":
        return "Da Nang";
      default:
        return normalized;
    }
  }, []);

  // Hàm chuẩn hóa location từ jobs
  const normalizeJobLocation = useCallback((location) => {
    if (!location) return location;
    return location.trim();
  }, []);

  // Hàm trích xuất kinh nghiệm
  const extractExperience = useCallback((requirements) => {
    if (!requirements) return "Không xác định";
    const lowerReq = requirements.toLowerCase();
    if (lowerReq.includes("không cần kinh nghiệm"))
      return "Không cần kinh nghiệm";
    const experienceMatch = lowerReq.match(/(\d+)(?:\s*-\s*(\d+))?\s*năm/);
    if (experienceMatch) {
      return `${experienceMatch[2] || experienceMatch[1]} năm`;
    }
    return "Không xác định";
  }, []);

  // Hàm trích xuất trình độ
  const extractEducation = useCallback((requirements) => {
    if (!requirements) return "Không yêu cầu";
    const lowerReq = requirements.toLowerCase();
    if (
      lowerReq.includes("tốt nghiệp đại học") ||
      lowerReq.includes("đại học")
    ) {
      return "Đại học";
    }
    if (
      lowerReq.includes("tốt nghiệp cao đẳng") ||
      lowerReq.includes("cao đẳng")
    ) {
      return "Cao đẳng";
    }
    if (
      lowerReq.includes("tốt nghiệp trung cấp") ||
      lowerReq.includes("trung cấp trở lên") ||
      lowerReq.includes("trung cấp")
    ) {
      return "Trung cấp";
    }
    if (
      lowerReq.includes("tốt nghiệp thpt") ||
      lowerReq.includes("trung học") ||
      lowerReq.includes("thpt")
    ) {
      return "Trung học";
    }
    return "Không yêu cầu";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch dữ liệu và đồng bộ favorites từ server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jobsResponse, companiesResponse, savedJobsResponse] =
          await Promise.all([
            axios.get(
              "https://easyfindwork-jsonserver-production.up.railway.app/jobs"
            ),
            axios.get(
              "https://easyfindwork-jsonserver-production.up.railway.app/companies"
            ),
            axios.get(
              `https://easyfindwork-jsonserver-production.up.railway.app/savedJobs${
                user && user.id ? `?userId=${user.id}` : ""
              }`
            ),
          ]);

        const jobsData = jobsResponse.data;
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setCompanies(companiesResponse.data);

        // Đồng bộ favorites từ savedJobs cho người dùng hiện tại
        const savedJobIds = savedJobsResponse.data.map(
          (savedJob) => savedJob.jobId
        );
        setFavorites(savedJobIds);
        localStorage.setItem("jobFavorites", JSON.stringify(savedJobIds));

        const uniqueIndustries = [
          ...new Set(jobsData.map((job) => normalizeIndustry(job.industry))),
        ]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, "vi"));
        setIndustries(uniqueIndustries);
        // Tạo danh sách kinh nghiệm
        const experiences = jobsData
          .map((job) => extractExperience(job.requirements))
          .filter((exp) => exp !== "Không xác định");
        const uniqueExperiences = [...new Set(experiences)].sort((a, b) => {
          if (a === "Không cần kinh nghiệm") return -1;
          if (b === "Không cần kinh nghiệm") return 1;
          const aYear = parseInt(a) || 0;
          const bYear = parseInt(b) || 0;
          return aYear - bYear;
        });
        setExperienceOptions(uniqueExperiences);

        // Tạo danh sách trình độ
        const educations = jobsData.map((job) =>
          extractEducation(job.requirements)
        );
        const uniqueEducations = [...new Set(educations)].sort((a, b) => {
          const order = [
            "Không yêu cầu",
            "Trung học",
            "Trung cấp",
            "Cao đẳng",
            "Đại học",
          ];
          return order.indexOf(a) - order.indexOf(b);
        });
        setEducationOptions(uniqueEducations);

        // Tạo danh sách tỉnh thành
        const provinceData = provinces.map((province) => ({
          name: province.name,
          normalizedName: normalizeProvinceName(province.name),
        }));
        const sortedProvinces = provinceData.sort((a, b) =>
          a.name.localeCompare(b.name, "vi")
        );
        setProvinceOptions(sortedProvinces);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
        // Fallback to localStorage if server fails
        const savedFavorites = localStorage.getItem("jobFavorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [normalizeProvinceName, extractExperience, extractEducation, user]);

  // Lưu favorites vào localStorage
  useEffect(() => {
    localStorage.setItem("jobFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Đếm số bộ lọc đang áp dụng
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (filterIndustry) count++;
    if (filterLocation) count++;
    if (filterExperience) count++;
    if (filterSalary) count++;
    if (filterEducation) count++;
    setActiveFiltersCount(count);
  }, [
    searchQuery,
    filterIndustry,
    filterLocation,
    filterExperience,
    filterSalary,
    filterEducation,
  ]);

  // Auto-filter khi các bộ lọc thay đổi
  useEffect(() => {
    if (jobs.length > 0) {
      performSearchAndFilter();
    }
  }, [
    jobs,
    searchQuery,
    filterIndustry,
    filterLocation,
    filterExperience,
    filterSalary,
    filterEducation,
  ]);

  // Logic tìm kiếm và lọc
  const performSearchAndFilter = useCallback(() => {
    setCurrentPage(1);
    const keyword = searchQuery.trim().toLowerCase();
    const filtered = jobs.filter((job) => {
      const matchesSearch = keyword
        ? job.title?.toLowerCase().includes(keyword)
        : true;
      const matchesIndustry = filterIndustry
        ? normalizeIndustry(job.industry) === normalizeIndustry(filterIndustry)
        : true;
      const matchesLocation = filterLocation
        ? normalizeJobLocation(job.location) ===
          normalizeProvinceName(filterLocation)
        : true;
      const matchesExperience = filterExperience
        ? extractExperience(job.requirements)
            .toString()
            .toLowerCase()
            .includes(filterExperience.toLowerCase())
        : true;
      const matchesSalary = filterSalary
        ? filterSalary === "Thỏa thuận"
          ? !job.salaryMin && !job.salaryMax
          : filterSalary === ""
          ? true
          : (() => {
              const selectedOption = salaryOptions.find(
                (option) => option.value === filterSalary
              );
              if (!selectedOption || !selectedOption.range) return false;
              const { min, max } = selectedOption.range;
              return (
                (job.salaryMin >= min && job.salaryMin <= max) ||
                (job.salaryMax >= min && job.salaryMax <= max) ||
                (job.salaryMin <= min && job.salaryMax >= max)
              );
            })()
        : true;
      const matchesEducation = filterEducation
        ? extractEducation(job.requirements) === filterEducation
        : true;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesLocation &&
        matchesExperience &&
        matchesSalary &&
        matchesEducation
      );
    });
    setFilteredJobs(filtered);

    // Cập nhật URL
    const queryParams = new URLSearchParams({
      searchQuery,
      filterIndustry,
      filterLocation,
    }).toString();
    navigate(`/job-search?${queryParams}`, { replace: true });
  }, [
    jobs,
    searchQuery,
    filterIndustry,
    filterLocation,
    filterExperience,
    filterSalary,
    filterEducation,
    normalizeJobLocation,
    normalizeProvinceName,
    extractExperience,
    extractEducation,
    navigate,
  ]);

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    performSearchAndFilter();
  };

  // Xử lý nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearchAndFilter();
    }
  };
  // Toggle favorite với đồng bộ server
  const toggleFavorite = useCallback(
    async (jobId) => {
      if (!user || !user.id) {
        message.error("Vui lòng đăng nhập để lưu công việc yêu thích.");
        return;
      }

      const isFavorite = favorites.includes(jobId);
      try {
        if (isFavorite) {
          // Xóa khỏi yêu thích
          const savedJobResponse = await axios.get(
            `https://easyfindwork-jsonserver-production.up.railway.app/savedJobs?jobId=${jobId}&userId=${user.id}`
          );
          const savedJob = savedJobResponse.data[0];
          if (savedJob) {
            await axios.delete(
              `https://easyfindwork-jsonserver-production.up.railway.app/savedJobs/${savedJob.id}`
            );
            setFavorites((prev) => prev.filter((id) => id !== jobId));
            message.success({
              content: "Đã xóa khỏi mục yêu thích",
              duration: 2,
              style: { marginTop: "20px" },
            });
            window.dispatchEvent(new CustomEvent("savedJobsUpdated")); // Thông báo cập nhật
          }
        } else {
          // Thêm vào yêu thích
          await axios.post(
            "https://easyfindwork-jsonserver-production.up.railway.app/savedJobs",
            {
              jobId,
              userId: user.id,
            }
          );
          setFavorites((prev) => [...prev, jobId]);
          message.success({
            content: "Đã thêm vào mục yêu thích",
            duration: 2,
            style: { marginTop: "20px" },
          });
          window.dispatchEvent(new CustomEvent("savedJobsUpdated")); // Thông báo cập nhật
        }
      } catch (error) {
        console.error("Error updating favorite:", error);
        message.error("Không thể cập nhật yêu thích. Vui lòng thử lại sau.");
      }
    },
    [favorites, user]
  );
  // Xóa tất cả bộ lọc
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilterIndustry("");
    setFilterLocation("");
    setFilterExperience("");
    setFilterSalary("");
    setFilterEducation("");
  }, []);

  // Phân trang
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const visibleJobs = useMemo(
    () => filteredJobs.slice(startIndex, endIndex),
    [filteredJobs, startIndex, endIndex]
  );

  // Lấy logo và tên công ty
  const getCompanyLogo = useCallback(
    (companyId) => {
      const company = companies.find((c) => c.id === companyId);
      return company?.logo || "/placeholder.svg?height=40&width=40";
    },
    [companies]
  );

  const getCompanyName = useCallback(
    (companyId) => {
      const company = companies.find((c) => c.id === companyId);
      return company?.name || "Unknown Company";
    },
    [companies]
  );

  // Format lương
  const formatSalary = useCallback((value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Tính thời gian còn lại
  const getRemainingTime = useCallback((deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;
    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (daysRemaining > 0) {
      return `Còn ${daysRemaining} ngày`;
    } else if (timeDiff > 0) {
      return `Còn ${hoursRemaining} giờ`;
    } else {
      return "Đã hết hạn";
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top.DOMAIN_SEPARATOR transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm công việc..."
                  className="py-3 pl-10 pr-4 rounded-lg border-gray-200 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                  aria-label="Tìm kiếm công việc"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  size="large"
                />
              </div>
              <div className="relative">
                <Select
                  placeholder="Lọc theo ngành nghề"
                  className="w-full"
                  suffixIcon={<FiBriefcase className="text-gray-400" />}
                  aria-label="Lọc theo ngành nghề"
                  value={filterIndustry}
                  onChange={(value) => setFilterIndustry(value)}
                  size="large"
                  dropdownStyle={{ borderRadius: "0.5rem" }}
                >
                  <Option value="">Tất cả ngành nghề</Option>
                  {industries.map((industry, index) => (
                    <Option key={`${industry}-${index}`} value={industry}>
                      {industry}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="relative">
                <Select
                  placeholder="Lọc theo tỉnh thành"
                  className="w-full"
                  suffixIcon={<FiMapPin className="text-gray-400" />}
                  aria-label="Lọc theo tỉnh thành"
                  value={filterLocation}
                  onChange={(value) => setFilterLocation(value)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  size="large"
                  dropdownStyle={{ borderRadius: "0.5rem" }}
                >
                  <Option value="">Tất cả tỉnh thành</Option>
                  {provinceOptions.map((province, index) => (
                    <Option
                      key={`${province.normalizedName}-${index}`}
                      value={province.normalizedName}
                    >
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Button
                type="primary"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 h-12 rounded-lg font-semibold transition-all duration-200 border-0 shadow-md hover:shadow-lg flex items-center justify-center"
                aria-label="Tìm kiếm"
                size="large"
              >
                <FiSearch className="mr-2" /> Tìm kiếm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              <Button
                className={`${
                  showAdvancedFilters
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                } px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 flex items-center`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FiFilter className="mr-2" /> Lọc nâng cao
                {activeFiltersCount > 0 && (
                  <Badge
                    count={activeFiltersCount}
                    className="ml-2"
                    style={{ backgroundColor: "#4f46e5" }}
                  />
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  className="text-gray-600 hover:text-indigo-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
                  onClick={clearAllFilters}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100 animate-fade-in">
                <div className="relative">
                  <Select
                    placeholder="Tất cả kinh nghiệm"
                    className="w-full"
                    value={filterExperience}
                    onChange={(value) => setFilterExperience(value)}
                    size="large"
                    suffixIcon={<FiUser className="text-gray-400" />}
                  >
                    <Option value="">Tất cả kinh nghiệm</Option>
                    {experienceOptions.map((exp, index) => (
                      <Option key={`${exp}-${index}`} value={exp}>
                        {exp}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="relative">
                  <Select
                    placeholder="Tất cả mức lương"
                    className="w-full"
                    value={filterSalary}
                    onChange={(value) => setFilterSalary(value)}
                    size="large"
                    suffixIcon={<FiDollarSign className="text-gray-400" />}
                  >
                    {salaryOptions.map((option, index) => (
                      <Option
                        key={`${option.value}-${index}`}
                        value={option.value}
                      >
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="relative">
                  <Select
                    placeholder="Tất cả trình độ"
                    className="w-full"
                    value={filterEducation}
                    onChange={(value) => setFilterEducation(value)}
                    size="large"
                    suffixIcon={<FiBookOpen className="text-gray-400" />}
                  >
                    <Option value="">Tất cả trình độ</Option>
                    {educationOptions.map((edu, index) => (
                      <Option key={`${edu}-${index}`} value={edu}>
                        {edu}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb Section */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                <Link
                  to="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Trang Chủ
                </Link>{" "}
                /{" "}
                <Link
                  to="/tuyen-dung"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Tuyển Dụng
                </Link>
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                Tuyển dụng
                <span> </span>
                <span className="text-indigo-600">
                  {totalJobs.toLocaleString()}
                </span>{" "}
                việc làm mới nhất năm{" "}
                <span className="text-indigo-600">2025</span>
              </h2>
              {/* <a
                href="#"
                className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
              >
                <FiHeart className="mr-1" /> Lưu tìm kiếm này
              </a> */}
            </div>
            <div className="mt-4 md:mt-0">
              {/* <Button
                type="default"
                className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium border-0 shadow-sm hover:shadow transition-all duration-200"
              >
                <FiHeart className="mr-2 inline-block" /> Tìm kiếm đã lưu (0)
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiBriefcase className="mr-2 text-indigo-600" /> Cơ hội việc làm{" "}
            {filterIndustry && (
              <span className="text-indigo-600"> {filterIndustry}</span>
            )}
            {filteredJobs.length > 0 && (
              <span className="ml-2 text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {filteredJobs.length}
              </span>
            )}
          </h2>
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            Trang {currentPage}/
            {Math.ceil(filteredJobs.length / jobsPerPage) || 1}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={index}
                  className="rounded-lg shadow-md border-0 overflow-hidden"
                >
                  <Skeleton avatar active paragraph={{ rows: 3 }} />
                </Card>
              ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleJobs.map((job) => (
              <Card
                key={job.id}
                className="rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                styles={{ body: { padding: 0 } }}
              >
                <div className="absolute top-4 right-4 z-10">
                  <Tooltip
                    title={
                      favorites.includes(job.id)
                        ? "Xóa khỏi yêu thích"
                        : "Thêm vào yêu thích"
                    }
                  >
                    <Button
                      shape="circle"
                      icon={
                        <FiHeart
                          size={18}
                          className={
                            favorites.includes(job.id) ? "fill-current" : ""
                          }
                        />
                      }
                      onClick={() => toggleFavorite(job.id)}
                      className={`flex items-center justify-center ${
                        favorites.includes(job.id)
                          ? "bg-red-50 text-red-500 border-red-100"
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                      }`}
                      aria-label={
                        favorites.includes(job.id)
                          ? "Xóa khỏi yêu thích"
                          : "Thêm vào yêu thích"
                      }
                    />
                  </Tooltip>
                </div>
                <div className="p-5">
                  <div className="flex items-start">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                      <img
                        src={getCompanyLogo(job.companyId)}
                        alt={getCompanyName(job.companyId)}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src = "/placeholder.svg?height=48&width=48")
                        }
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 line-clamp-2 leading-tight">
                        <Link to={`/job/${job.id}`} className="hover:underline">
                          {job.title}
                        </Link>
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {getCompanyName(job.companyId)}
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-indigo-600 font-semibold">
                          {job.salaryMin && job.salaryMax
                            ? `${formatSalary(job.salaryMin)} - ${formatSalary(
                                job.salaryMax
                              )}`
                            : "Thỏa thuận"}
                        </p>
                      </div>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <FiMapPin size={14} className="mr-1 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock size={14} className="mr-1 text-gray-400" />
                          <span>{getRemainingTime(job.deadline)}</span>
                        </div>
                        <Tag
                          color={
                            job.deadline && new Date(job.deadline) > new Date()
                              ? "green"
                              : "red"
                          }
                        >
                          {job.deadline && new Date(job.deadline) > new Date()
                            ? "Đang tuyển"
                            : "Hết hạn"}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="flex flex-col items-center">
              <FiSearch size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy công việc
              </h3>
              <p className="text-gray-500 max-w-md mb-6">
                Không tìm thấy công việc nào phù hợp với tiêu chí tìm kiếm.
              </p>
              <Button
                type="primary"
                onClick={clearAllFilters}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center items-center mt-8">
            <Button
              disabled={currentPage === 1}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`rounded-full ${
                currentPage === 1
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
              }`}
              aria-label="Trang trước"
            >
              Trang trước
            </Button>
            <div className="mx-4 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              {currentPage} /{" "}
              {Math.ceil(filteredJobs.length / jobsPerPage) || 1}
            </div>
            <Button
              disabled={
                currentPage === Math.ceil(filteredJobs.length / jobsPerPage) ||
                filteredJobs.length === 0
              }
              onClick={() =>
                currentPage < Math.ceil(filteredJobs.length / jobsPerPage) &&
                setCurrentPage(currentPage + 1)
              }
              className={`rounded-full ${
                currentPage === Math.ceil(filteredJobs.length / jobsPerPage) ||
                filteredJobs.length === 0
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
              }`}
              aria-label="Trang sau"
            >
              Trang sau
            </Button>
          </div>
        )}

        {/* Suggested Jobs Section */}
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center tracking-tight">
            <span className="text-yellow-500 mr-3 animate-pulse">⭐</span>
            Việc làm gợi ý
            <span className="ml-auto">
              <Button
                type="link"
                className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
              >
                Xem tất cả <FiArrowRight className="ml-1" />
              </Button>
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestedJobs.map((job) => (
              <Card
                key={job.id}
                className="relative rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 overflow-hidden"
                styles={{ body: { padding: 0 } }}
              >
                <div className="p-5">
                  <div className="flex items-start">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 transition-transform duration-300 hover:scale-105">
                      <img
                        src={getCompanyLogo(job.companyId)}
                        alt={getCompanyName(job.companyId)}
                        className="w-full h-full object-cover transition-opacity duration-200"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src = "/placeholder.svg?height=56&width=56")
                        }
                      />
                    </div>
                    <div className="ml-5 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 line-clamp-2 leading-tight">
                        <Link to={`/job/${job.id}`} className="hover:underline">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 font-medium">
                        {getCompanyName(job.companyId)}
                      </p>
                      <p className="text-sm text-indigo-600 font-semibold mt-2">
                        {job.salaryMin && job.salaryMax
                          ? `${formatSalary(job.salaryMin)} - ${formatSalary(
                              job.salaryMax
                            )}`
                          : "Thỏa thuận"}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <FiMapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="border-t border-gray-100 mt-3 pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <FiClock className="w-4 h-4 mr-1.5 text-gray-400" />
                            <span>{getRemainingTime(job.deadline)}</span>
                          </div>
                          <Tag
                            color={
                              job.deadline &&
                              new Date(job.deadline) > new Date()
                                ? "green"
                                : "red"
                            }
                          >
                            {job.deadline && new Date(job.deadline) > new Date()
                              ? "Đang tuyển"
                              : "Hết hạn"}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(job.id)}
                    className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                      favorites.includes(job.id)
                        ? "bg-red-100 text-red-500 hover:bg-red-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                    aria-label={
                      favorites.includes(job.id)
                        ? "Xóa khỏi yêu thích"
                        : "Thêm vào yêu thích"
                    }
                  >
                    <FiHeart
                      className={`w-5 h-5 ${
                        favorites.includes(job.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <MyChatBot />
    </div>
  );
}
