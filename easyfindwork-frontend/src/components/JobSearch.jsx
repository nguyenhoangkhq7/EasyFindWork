"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

const { Option } = Select;

export default function JobSearch() {
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
  // Fetch dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jobsResponse, companiesResponse] = await Promise.all([
          axios.get("http://localhost:3000/jobs"),
          axios.get("http://localhost:3000/companies"),
        ]);

        const jobsData = jobsResponse.data;
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setCompanies(companiesResponse.data);

        // Trích xuất danh sách ngành nghề duy nhất

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Load favorites từ localStorage
    const savedFavorites = localStorage.getItem("jobFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [normalizeProvinceName, extractExperience, extractEducation]);

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
      // const matchesIndustry = filterIndustry ? job.industry?.toLowerCase() === filterIndustry.toLowerCase() : true;
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

  // Toggle favorite
  // Toggle favorite với thông báo
  const toggleFavorite = useCallback((jobId) => {
    setFavorites((prev) => {
      if (prev.includes(jobId)) {
        message.success({
          content: "Đã xóa khỏi mục yêu thích",
          duration: 2,
          style: {
            marginTop: "20px",
          },
        });
        return prev.filter((id) => id !== jobId);
      } else {
        message.success({
          content: "Đã thêm vào mục yêu thích",
          duration: 2,
          style: {
            marginTop: "20px",
          },
        });
        return [...prev, jobId];
      }
    });
  }, []);

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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight animate-fade-in">
            Tìm Việc Làm Mơ Ước
            <span className="ml-2 bg-yellow-300 text-indigo-900 text-sm font-bold px-3 py-1 rounded-full align-middle">
              4,815
            </span>
          </h1>
          <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                Tuyển dụng <span className="text-indigo-600">4,815</span> việc
                làm mới nhất năm <span className="text-indigo-600">2025</span>
              </h2>
              <a
                href="#"
                className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
              >
                <FiHeart className="mr-1" /> Lưu tìm kiếm này
              </a>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                type="default"
                className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium border-0 shadow-sm hover:shadow transition-all duration-200"
              >
                <FiHeart className="mr-2 inline-block" /> Tìm kiếm đã lưu (0)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiBriefcase className="mr-2 text-indigo-600" /> Cơ hội việc làm
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
                styles={{ body: { padding: 0 } }} // Sửa từ bodyStyle sang styles.body
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
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100 border-gray-100"
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
                      <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors text-lg">
                        <Link
                          to={`/job-search?searchQuery=${encodeURIComponent(
                            job.title
                          )}`}
                        >
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
                styles={{ body: { padding: 0 } }} // Sửa từ bodyStyle sang styles.body
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
                        <Link
                          to={`/jobs/${job.id}`}
                          className="hover:underline"
                        >
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

      {/* Footer */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4 border-b border-indigo-700 pb-2">
                Việc làm theo ngành nghề
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setFilterIndustry("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`text-sm font-medium transition hover:text-indigo-600 ${
                    filterIndustry === ""
                      ? "text-indigo-600 underline"
                      : "text-gray-600"
                  }`}
                >
                  Tất cả ngành nghề
                </a>

                {visibleIndustries.map((industry, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilterIndustry(industry);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`text-sm font-medium transition hover:text-indigo-600 ${
                      filterIndustry === industry
                        ? "text-indigo-600 underline"
                        : "text-gray-600"
                    }`}
                  >
                    {industry}
                  </a>
                ))}

                {industries.length > 5 && (
                  <button
                    onClick={() => setShowAllIndustries(!showAllIndustries)}
                    className="text-sm font-medium text-indigo-600 underline focus:outline-none"
                  >
                    {showAllIndustries ? "Thu gọn" : "Hiện tất cả"}
                  </button>
                )}
              </div>
            </Col>
            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4 border-b border-indigo-700 pb-2">
                Việc làm theo khu vực
              </h3>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setFilterLocation("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`text-sm font-medium transition hover:text-indigo-600 ${
                    filterLocation === ""
                      ? "text-indigo-600 underline"
                      : "text-gray-600"
                  }`}
                >
                  Tất cả tỉnh thành
                </a>

                {visibleProvinces.map((province, index) => (
                  <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilterLocation(province.normalizedName);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`text-sm font-medium transition hover:text-indigo-600 ${
                      filterLocation === province.normalizedName
                        ? "text-indigo-600 underline"
                        : "text-gray-600"
                    }`}
                  >
                    {province.name}
                  </a>
                ))}

                {provinceOptions.length > 6 && (
                  <button
                    onClick={() => setShowAllProvinces(!showAllProvinces)}
                    className="text-sm font-medium text-indigo-600 underline focus:outline-none"
                  >
                    {showAllProvinces ? "Thu gọn" : "Hiện tất cả"}
                  </button>
                )}
              </div>
            </Col>

            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4 border-b border-indigo-700 pb-2">
                Liên hệ
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  HCM: (028) 7309 2434
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Hà Nội: (024) 7309 2434
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email: info@vieclam24h.vn
                </li>
                <li className="mt-4">
                  <Button
                    type="primary"
                    className="bg-indigo-500 hover:bg-indigo-600 border-0 rounded-lg w-full"
                  >
                    Đăng ký nhận việc làm mới
                  </Button>
                </li>
              </ul>
            </Col>
          </Row>
          <div className="mt-12 pt-6 border-t border-indigo-800 text-center text-sm">
            <p>© 2025 Vieclam24h.vn - Tìm việc làm nhanh, hiệu quả</p>
            <div className="flex justify-center mt-4 space-x-4">
              <a
                href="#"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
