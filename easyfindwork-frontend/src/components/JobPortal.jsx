"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiSearch,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiBriefcase,
  FiBookOpen,
  FiArrowRight,
  FiStar,
  FiClock,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  Input,
  Select,
  Button,
  Card,
  Skeleton,
  Row,
  Col,
  Tag,
  Tooltip,
  Divider,
  message,
  Modal,
} from "antd";
import Anh1 from "../assets/Anh1.png";
import Anh2 from "../assets/Anh2.png";
import Anh3 from "../assets/Anh3.png";
import { provinces } from "vietnam-provinces";

const { Option } = Select;

export default function JobPortal() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Lấy user từ Redux
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProfession, setFilterProfession] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAllProvinces, setShowAllProvinces] = useState(false);
  const [showAllIndustriesModal, setShowAllIndustriesModal] = useState(false);
  const [showAllProvincesModal, setShowAllProvincesModal] = useState(false);
  const [showAllNewJobsModal, setShowAllNewJobsModal] = useState(false);
  const [showAllFeaturedCompaniesModal, setShowAllFeaturedCompaniesModal] = useState(false);
  const jobsPerPage = 9;
  const visibleIndustries = showAllIndustries
    ? industries
    : industries.slice(0, 5);
  const visibleProvinces = showAllProvinces
    ? provinceOptions
    : provinceOptions.slice(0, 5);

  // Hàm chuyển đổi size thành số lượng tối thiểu để so sánh
  const parseSizeToMinNumber = (size) => {
    if (size.includes('+')) {
      return parseInt(size.replace('+ người', ''), 10);
    } else {
      const minSize = size.split('-')[0];
      return parseInt(minSize, 10);
    }
  };
  // Hàm kiểm tra công việc tuyển gấp (deadline còn dưới 10 ngày)
  const isUrgentJob = useCallback((deadline) => {
    if (!deadline) return false;
    const now = new Date("2025-05-05");
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;
    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 && daysRemaining <= 15;
  }, []);

  // Lọc các công ty có size từ 1000 người trở lên
  const featuredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const minSize = parseSizeToMinNumber(company.size);
      return minSize >= 1000 || company.size === "5000+ người";
    }).slice(0, 6);
  }, [companies]);

  // Lấy tất cả công ty nổi bật
  const allFeaturedCompanies = useMemo(() => {
    return companies.filter((company) => {
      const minSize = parseSizeToMinNumber(company.size);
      return minSize >= 1000 || company.size === "5000+ người";
    });
  }, [companies]);

  // Lọc các công việc có postedDate trong 5 ngày gần nhất
  const currentDate = new Date("2025-05-04");
  const fiveDaysAgo = new Date(currentDate);
  fiveDaysAgo.setDate(currentDate.getDate() - 5);

  const newJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const postedDate = new Date(job.postedDate);
        return postedDate >= fiveDaysAgo && postedDate <= currentDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.postedDate);
        const dateB = new Date(b.postedDate);
        return dateB - dateA || a.id.localeCompare(b.id);
      });
  }, [jobs]);

  const newJobsLimited = useMemo(() => {
    return newJobs.slice(0, 6);
  }, [newJobs]);

  // Ánh xạ icon cho các ngành
  const industryIcons = {
    "Kế toán": "📊",
    "Hành chính": "📝",
    "Nhân sự": "📝",
    "Chăm sóc khách hàng": "📞",
    "Bán lẻ": "🛒",
    "Kỹ thuật": "🔧",
    "Công nghệ thông tin": "💻",
    Marketing: "📈",
    "Xây dựng": "🏗️",
    "Tài chính": "💰",
    "Bất động sản": "🏠",
    "Cơ khí": "⚙️",
    "Xuất nhập khẩu": "🚢",
    "Thiết kế": "🎨",
    Logistics: "🚚",
    "Pháp chế": "⚖️",
    "Chất lượng": "✅",
    "Môi trường": "🌱",
    "Truyền thông": "📢",
    "Sản xuất": "🏭",
    "Cơ điện": "🔌",
    "Kinh doanh quốc tế": "🌍",
    "Quan hệ quốc tế": "🤝",
    "Kiểm toán": "📑",
    "Dầu khí": "🛢️",
    "Thủy sản": "🐟",
    "Thực phẩm": "🍴",
    "Ngân hàng": "🏦",
    "Y tế": "⚕️",
    "Kinh doanh, Kỹ thuật": "💼",
  };

  const getRandomJobs = useCallback((jobs, n) => {
    if (!jobs || jobs.length === 0) return [];
    const shuffled = [...jobs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, jobs.length));
  }, []);

  const suggestedJobs = useMemo(
    () => getRandomJobs(jobs, 9),
    [jobs, getRandomJobs]
  );

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
      case "Toàn quốc":
        return "";
      default:
        return normalized;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jobsResponse, companiesResponse, savedJobsResponse] = await Promise.all([
          axios.get("http://localhost:3000/jobs"),
          axios.get("http://localhost:3000/companies"),
          user?.id ? axios.get(`http://localhost:3000/savedJobs?userId=${user.id}`) : Promise.resolve({ data: [] }),
        ]);
        const jobsData = jobsResponse.data.map((job) => ({
          ...job,
          location: normalizeProvinceName(job.location),
        }));
        setJobs(jobsData);
        setCompanies(companiesResponse.data);
        setSavedJobs(savedJobsResponse.data);

        // Đồng bộ favorites với savedJobs từ server
        const userSavedJobs = savedJobsResponse.data.map((sj) => sj.jobId);
        setFavorites(userSavedJobs);
        localStorage.setItem("jobFavorites", JSON.stringify(userSavedJobs));

        const uniqueIndustries = [
          ...new Set(jobsData.map((job) => job.industry)),
        ]
          .filter(Boolean)
          .sort();
        setIndustries(uniqueIndustries);

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
        message.error("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [normalizeProvinceName, user?.id]);

  useEffect(() => {
    localStorage.setItem("jobFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const industryCounts = useMemo(() => {
    return industries.map((industry) => ({
      name: industry,
      count: jobs.filter((job) => job.industry === industry).length,
      icon: industryIcons[industry] || "💼",
    }));
  }, [jobs, industries]);

  const toggleFavorite = useCallback(
    async (jobId) => {
      if (!user?.id) {
        message.error("Vui lòng đăng nhập để lưu công việc yêu thích.");
        return;
      }

      const isFavorite = favorites.includes(jobId);
      try {
        if (isFavorite) {
          // Xóa khỏi yêu thích
          const savedJobResponse = await axios.get(
            `http://localhost:3000/savedJobs?jobId=${jobId}&userId=${user.id}`
          );
          const savedJob = savedJobResponse.data[0];
          if (savedJob) {
            await axios.delete(`http://localhost:3000/savedJobs/${savedJob.id}`);
            setFavorites((prev) => prev.filter((id) => id !== jobId));
            setSavedJobs((prev) => prev.filter((sj) => sj.id !== savedJob.id));
            message.success({
              content: "Đã xóa khỏi mục yêu thích",
              duration: 2,
              style: { marginTop: "20px" },
            });
            window.dispatchEvent(new CustomEvent("savedJobsUpdated"));
          } else {
            console.error("Không tìm thấy savedJob để xóa:", jobId);
          }
        } else {
          // Thêm vào yêu thích
          const newSavedJob = {
            jobId,
            userId: user.id,
            savedAt: new Date().toISOString(),
          };
          const response = await axios.post("http://localhost:3000/savedJobs", newSavedJob);
          console.log("Đã lưu công việc:", response.data);
          setFavorites((prev) => [...prev, jobId]);
          setSavedJobs((prev) => [...prev, response.data]);
          message.success({
            content: "Đã thêm vào mục yêu thích",
            duration: 2,
            style: { marginTop: "20px" },
          });
          window.dispatchEvent(new CustomEvent("savedJobsUpdated"));
        }
      } catch (error) {
        console.error("Error updating favorite:", error.response?.data || error.message);
        message.error("Không thể cập nhật yêu thích. Vui lòng thử lại sau.");
      }
    },
    [favorites, user?.id]
  );
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = searchQuery
        ? job.title?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesProfession = filterProfession
        ? job.category === filterProfession
        : true;
      const matchesLocation = filterLocation
        ? normalizeProvinceName(job.location) === filterLocation
        : true;
      const matchesIndustry = filterIndustry ? job.industry?.includes(filterIndustry) : true;
      const isUrgent = isUrgentJob(job.deadline);
      return matchesSearch && matchesProfession && matchesLocation && matchesIndustry && isUrgent;
    });
  }, [jobs, searchQuery, filterProfession, filterLocation, filterIndustry, normalizeProvinceName, isUrgentJob]);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const visibleJobs = filteredJobs.slice(startIndex, endIndex);

  const getCompanyLogo = useCallback(
    (companyId) => {
      const company = companies.find((c) => c.id === companyId);
      return company?.logo || "/placeholder.svg?height=48&width=48";
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

  const formatSalary = useCallback((value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const getRemainingTime = useCallback((deadline) => {
    if (!deadline) return "Không xác định";

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

  const getJobStatus = useCallback((deadline) => {
    if (!deadline) return "unknown";

    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate > now ? "active" : "expired";
  }, []);

  const handleSearch = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) {
      queryParams.set("searchQuery", encodeURIComponent(searchQuery));
    }
    if (filterProfession) {
      queryParams.set("filterProfession", encodeURIComponent(filterProfession));
    }
    if (filterLocation) {
      queryParams.set("filterLocation", encodeURIComponent(filterLocation));
    }
    if (filterIndustry) {
      queryParams.set("filterIndustry", encodeURIComponent(filterIndustry));
    }

    if (!queryParams.toString()) {
      message.warning({
        content: "Vui lòng chọn ít nhất một bộ lọc để tìm kiếm!",
        duration: 2,
        style: { marginTop: "20px" },
      });
      return;
    }

    navigate(
      `/job-search${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`,
      { state: { scrollToTop: true } }
    );
  }, [searchQuery, filterProfession, filterLocation, filterIndustry, navigate]);

  const handleIndustryChange = useCallback(
    (value) => {
      setFilterIndustry(value);
      const queryParams = new URLSearchParams();
      if (value) {
        queryParams.set("filterIndustry", encodeURIComponent(value));
      }
      if (searchQuery.trim()) {
        queryParams.set("searchQuery", encodeURIComponent(searchQuery));
      }
      if (filterProfession) {
        queryParams.set(
          "filterProfession",
          encodeURIComponent(filterProfession)
        );
      }
      if (filterLocation) {
        queryParams.set("filterLocation", encodeURIComponent(filterLocation));
      }
      navigate(
        `/job-search${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`,
        { state: { scrollToTop: true } }
      );
    },
    [searchQuery, filterProfession, filterLocation, navigate]
  );

  const handleLocationChange = useCallback(
    (value) => {
      const normalizedValue = normalizeProvinceName(value);
      setFilterLocation(normalizedValue);
      const province = provinceOptions.find(
        (p) => p.normalizedName === normalizedValue
      );
      setDisplayLocation(province ? province.name : normalizedValue);

      const queryParams = new URLSearchParams();
      if (normalizedValue) {
        queryParams.set("filterLocation", encodeURIComponent(normalizedValue));
      }
      if (searchQuery.trim()) {
        queryParams.set("searchQuery", encodeURIComponent(searchQuery));
      }
      if (filterProfession) {
        queryParams.set(
          "filterProfession",
          encodeURIComponent(filterProfession)
        );
      }
      if (filterIndustry) {
        queryParams.set("filterIndustry", encodeURIComponent(filterIndustry));
      }
      navigate(
        `/job-search${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`,
        { state: { scrollToTop: true } }
      );
    },
    [
      searchQuery,
      filterProfession,
      filterIndustry,
      navigate,
      provinceOptions,
      normalizeProvinceName,
    ]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleIndustrySelect = (industry) => {
    handleIndustryChange(industry);
    setIsModalVisible(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Modal hiển thị tất cả các ngành */}
      <Modal
        title="Tất cả các ngành nghề"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Row gutter={[16, 16]}>
          {industryCounts
            .sort((a, b) => b.count - a.count)
            .map((category, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <div
                  onClick={() => handleIndustrySelect(category.name)}
                  className="flex items-center p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer bg-white"
                >
                  <div className="text-2xl mr-3">{category.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {category.name}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium">
                      {category.count.toLocaleString()} việc
                    </div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </Modal>

      {/* Modal phụ cho tất cả ngành nghề */}
      <Modal
        title="Tất cả ngành nghề"
        open={showAllIndustriesModal}
        onCancel={() => setShowAllIndustriesModal(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Row gutter={[16, 16]}>
          {industryCounts
            .sort((a, b) => b.count - a.count)
            .map((category, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <div
                  onClick={() => {
                    handleIndustryChange(category.name);
                    setShowAllIndustriesModal(false);
                  }}
                  className="flex items-center p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer bg-white"
                >
                  <div className="text-2xl mr-3">{category.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {category.name}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium">
                      {category.count.toLocaleString()} việc
                    </div>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </Modal>

      {/* Modal phụ cho tất cả tỉnh thành */}
      <Modal
        title="Tất cả tỉnh thành"
        open={showAllProvincesModal}
        onCancel={() => setShowAllProvincesModal(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Row gutter={[16, 16]}>
          {provinceOptions
            .sort((a, b) => a.name.localeCompare(b.name, "vi"))
            .map((province, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <div
                  onClick={() => {
                    handleLocationChange(province.normalizedName);
                    setShowAllProvincesModal(false);
                  }}
                  className="flex items-center p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer bg-white"
                >
                  <div className="text-sm font-semibold text-gray-800">
                    {province.name}
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </Modal>

      {/* Modal cho tất cả việc làm mới */}
      <Modal
        title="Tất cả việc làm mới"
        open={showAllNewJobsModal}
        onCancel={() => setShowAllNewJobsModal(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Row gutter={[16, 16]}>
          {newJobs.length > 0 ? (
            newJobs.map((job, index) => (
              <Col key={index} xs={24}>
                <div className="flex items-center p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer bg-white">
                  <div className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                    <Link to={`/job/${job.id}`}>{job.title}</Link>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={24}>
              <div className="text-sm text-gray-500 p-4 text-center">
                Không có việc làm mới trong 5 ngày gần đây.
              </div>
            </Col>
          )}
        </Row>
      </Modal>

      {/* Modal cho tất cả công ty nổi bật */}
      <Modal
        title="Tất cả công ty nổi bật"
        open={showAllFeaturedCompaniesModal}
        onCancel={() => setShowAllFeaturedCompaniesModal(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <Row gutter={[16, 16]}>
          {allFeaturedCompanies.length > 0 ? (
            allFeaturedCompanies.map((company, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <div
                  className="flex items-center p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer bg-white"
                >
                  <div className="w-16 h-16 mr-4 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm flex items-center justify-center bg-white">
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/placeholder.svg?height=64&width=64")}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{company.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{company.industry}</p>
                    <Tag color="blue" className="mt-2">
                      <span className="font-semibold">{jobs.filter((job) => job.companyId === company.id).length}</span>{" "}
                      vị trí đang tuyển
                    </Tag>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={24}>
              <div className="text-sm text-gray-500 p-4 text-center">
                Không có công ty nổi bật nào.
              </div>
            </Col>
          )}
        </Row>
      </Modal>

      {/* Job Search Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <Card className="rounded-2xl shadow-xl p-3 mb-10 border-0 transform hover:shadow-2xl transition-all duration-300">
          <div className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiSearch className="mr-2 text-indigo-600" />
            Tìm kiếm công việc mơ ước
          </div>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Nhập vị trí muốn ứng tuyển"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="py-2 pl-10 rounded-lg border-gray-200 hover:border-indigo-300 focus:border-indigo-500 transition-all"
                  aria-label="Tìm kiếm công việc"
                  size="large"
                />
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="relative">
                <Select
                  placeholder="Lọc theo ngành nghề"
                  className="w-full"
                  suffixIcon={<FiBriefcase className="text-gray-400" />}
                  aria-label="Lọc theo ngành nghề"
                  value={filterIndustry}
                  onChange={handleIndustryChange}
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
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="Lọc theo tỉnh thành"
                value={displayLocation}
                onChange={(value) => {
                  const normalizedValue = normalizeProvinceName(value);
                  setFilterLocation(normalizedValue);
                  const province = provinceOptions.find(
                    (p) => p.normalizedName === normalizedValue
                  );
                  setDisplayLocation(
                    province ? province.name : normalizedValue
                  );
                }}
                className="w-full"
                suffixIcon={<FiMapPin className="text-gray-400" />}
                aria-label="Lọc theo tỉnh thành"
                size="large"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
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
            </Col>
            <Col xs={24} md={24} className="flex justify-center">
              <Button
                type="primary"
                onClick={handleSearch}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 border-0 text-white px-8 py-2 h-auto rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                size="large"
                icon={<FiSearch className="mr-2" />}
              >
                Tìm việc
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Job Categories */}
        <Card className="rounded-2xl shadow-xl p-6 mb-10 border-0">
          <div className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiBriefcase className="mr-2 text-indigo-600" />
            Danh mục công việc
          </div>
          <Row gutter={[16, 16]} justify="space-between">
            {industryCounts
              .sort((a, b) => b.count - a.count)
              .slice(0, 7)
              .map((category, index) => (
                <Col key={index} xs={12} sm={8} md={6} lg={3}>
                  <div
                    onClick={() => handleIndustryChange(category.name)}
                    className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer h-full"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="text-sm font-semibold text-gray-800 text-center">
                      {category.name}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium mt-1">
                      {category.count.toLocaleString()} việc
                    </div>
                  </div>
                </Col>
              ))}
            <Col xs={12} sm={8} md={6} lg={3}>
              <div
                onClick={showModal}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all cursor-pointer h-full"
              >
                <div className="text-3xl mb-2 text-indigo-500">➕</div>
                <div className="text-sm font-semibold text-indigo-700 text-center">
                  Tất cả các ngành
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Urgent Jobs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold flex items-center">
              <span className="text-red-600 mr-2">🔥</span>
              <span className="bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
                Việc làm tuyển gấp
              </span>
            </div>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              Trang {currentPage}/
              {Math.ceil(filteredJobs.length / jobsPerPage) || 1}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <Button
              onClick={() => setFilterIndustry("")}
              className={`${
                filterIndustry === ""
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-indigo-50 text-indigo-700"
              } hover:bg-indigo-600 hover:text-white font-medium rounded-full px-4 transition-all duration-200`}
            >
              Tất cả
            </Button>
            <Button
              onClick={() => setFilterIndustry("Kinh doanh, Kỹ thuật")}
              className={`${
                filterIndustry === "Kinh doanh, Kỹ thuật"
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-indigo-50 text-indigo-700"
              } hover:bg-indigo-600 hover:text-white font-medium rounded-full px-4 transition-all duration-200`}
            >
              Kinh doanh, Kỹ thuật
            </Button>
            {industries.slice(0, 7).map((industry, index) => (
              <Button
                key={index}
                onClick={() => setFilterIndustry(industry)}
                className={`${
                  filterIndustry === industry
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-indigo-50 text-indigo-700"
                } hover:bg-indigo-600 hover:text-white font-medium rounded-full px-4 transition-all duration-200`}
              >
                {industry}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <Row gutter={[16, 16]}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <Col key={index} xs={24} sm={12} lg={8}>
                    <Card className="rounded-xl shadow-md border-0">
                      <Skeleton avatar active paragraph={{ rows: 3 }} />
                    </Card>
                  </Col>
                ))}
            </Row>
          ) : filteredJobs.length > 0 ? (
            <Row gutter={[16, 16]}>
              {visibleJobs.map((job) => (
                <Col key={job.id} xs={24} sm={12} lg={8}>
                  <Card
                    className="rounded-xl shadow-md border-gray-100 hover:border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    bodyStyle={{ padding: 0 }}
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
                        <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center shadow-sm">
                          <img
                            src={
                              getCompanyLogo(job.companyId) ||
                              "/placeholder.svg"
                            }
                            alt={getCompanyName(job.companyId)}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.target.src =
                                "/placeholder.svg?height=48&width=48")
                            }
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors text-lg">
                            <Link to={`/job/${job.id}`}>{job.title}</Link>
                          </h3>
                          <div className="text-sm text-gray-500 mt-1">
                            {getCompanyName(job.companyId)}
                          </div>
                          <div className="mt-3">
                            <Tag
                              color="blue"
                              className="rounded-full px-3 py-1 text-sm font-medium"
                            >
                              {job.salaryMin && job.salaryMax
                                ? `${formatSalary(
                                    job.salaryMin
                                  )} - ${formatSalary(job.salaryMax)}`
                                : "Thỏa thuận"}
                            </Tag>
                          </div>
                          <div className="flex items-center mt-3 text-sm text-gray-500">
                            <FiMapPin
                              size={14}
                              className="mr-1 text-gray-400"
                            />
                            <span>{job.location}</span>
                          </div>
                          <Divider className="my-3" />
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiClock
                                size={14}
                                className="mr-1 text-gray-400"
                              />
                              <span>{getRemainingTime(job.deadline)}</span>
                            </div>
                            <Tag
                              color={
                                getJobStatus(job.deadline) === "active"
                                  ? "success"
                                  : "error"
                              }
                              className="rounded-full"
                            >
                              {getJobStatus(job.deadline) === "active"
                                ? "Đang tuyển"
                                : "Hết hạn"}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center">
                <FiSearch size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Không tìm thấy công việc
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Không tìm thấy công việc tuyển gấp nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với các tiêu chí khác.
                </p>
                <Button
                  type="primary"
                  onClick={() => {
                    setFilterIndustry("");
                    setFilterLocation("");
                    setFilterProfession("");
                    setSearchQuery("");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 border-0"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="mt-10 flex flex-col items-center">
              <div className="flex justify-center items-center">
                <Button
                  icon={<FiChevronLeft size={20} />}
                  disabled={currentPage === 1}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className={`rounded-full ${
                    currentPage === 1
                      ? "text-gray-300 border-gray-200"
                      : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                  }`}
                  aria-label="Trang trước"
                />
                <div className="mx-4 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                  {currentPage} /{" "}
                  {Math.ceil(filteredJobs.length / jobsPerPage) || 1}
                </div>
                <Button
                  icon={<FiChevronRight size={20} />}
                  disabled={
                    currentPage ===
                      Math.ceil(filteredJobs.length / jobsPerPage) ||
                    filteredJobs.length === 0
                  }
                  onClick={() =>
                    currentPage <
                      Math.ceil(filteredJobs.length / jobsPerPage) &&
                    setCurrentPage(currentPage + 1)
                  }
                  className={`rounded-full ${
                    currentPage ===
                      Math.ceil(filteredJobs.length / jobsPerPage) ||
                    filteredJobs.length === 0
                      ? "text-gray-300 border-gray-200"
                      : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                  }`}
                  aria-label="Trang sau"
                />
              </div>
              <div className="flex justify-center items-center mt-4">
                {Array.from({
                  length: Math.ceil(filteredJobs.length / jobsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-3 h-3 mx-1 rounded-full transition-all duration-200 ${
                      currentPage === index + 1
                        ? "bg-indigo-600 transform scale-125"
                        : "bg-gray-300 hover:bg-indigo-400"
                    }`}
                    aria-label={`Trang ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Companies */}
        <Card className="rounded-2xl shadow-xl mb-12 border-0">
          <div className="flex items-center justify-between mb-6 p-3">
            <div className="text-2xl font-bold flex items-center">
              <span className="text-amber-500 mr-2">🏆</span>
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-transparent bg-clip-text">
                Công ty nổi bật
              </span>
            </div>
            <Button
              type="link"
              className="text-indigo-600 font-semibold flex items-center"
              onClick={() => setShowAllFeaturedCompaniesModal(true)}
            >
              Hiển thị tất cả <FiArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <Row gutter={[16, 16]} className="px-6 pb-6">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Col key={index} xs={12} sm={8} lg={4}>
                      <Card className="rounded-xl shadow-md border-0">
                        <Skeleton avatar active paragraph={{ rows: 2 }} />
                      </Card>
                    </Col>
                  ))
              : featuredCompanies.map((company) => {
                  const jobCount = jobs.filter((job) => job.companyId === company.id).length;
                  return (
                    <Col key={company.id} xs={12} sm={8} lg={4}>
                      <Link to={`/company/${company.id}`} className="block">
                        <Card
                          className="rounded-xl shadow-md border-gray-100 hover:border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 transition-all text-center cursor-pointer"
                          bodyStyle={{ padding: 20 }}
                        >
                          <div className="w-16 h-16 mb-4 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm mx-auto flex items-center justify-center bg-white">
                            <img
                              src={company.logo || "/placeholder.svg"}
                              alt={company.name}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.src = "/placeholder.svg?height=64&width=64")}
                            />
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{company.name}</h3>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-1">{company.industry}</p>
                          <Tag color="blue" className="rounded-full mx-auto">
                            <span className="font-semibold">{jobCount}</span> vị trí đang tuyển
                          </Tag>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
          </Row>
        </Card>

        {/* Suggested Jobs Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center tracking-tight">
            <span className="text-yellow-500 mr-3 animate-pulse">⭐</span>
            Việc làm gợi ý
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
                      <p className="text-sm text-gray-600 mt-2 font-medium">{getCompanyName(job.companyId)}</p>
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

        {/* Career Guides */}
        <Card className="rounded-2xl shadow-xl mb-12 border-0">
          <div className="flex items-center justify-between mb-6 p-3">
            <div className="text-2xl font-bold flex items-center">
              <FiBookOpen className="mr-2 text-indigo-600" size={24} />
              <span className="bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text">
                Cẩm nang nghề nghiệp
              </span>
            </div>
            <Button type="link" className="text-indigo-600 font-semibold flex items-center">
              <Link to="/guides/1">Nhân viên part time</Link>
              <Link to="/guides/2">Việc làm remote</Link>
              <Link to="/guides/3">Việc làm thêm ngoài giờ</Link>
            </Button>
          </div>
          <Row gutter={[16, 16]} className="px-6 pb-6">
            {[
              {
                id: 1,
                title:
                  "Nhân viên part time là gì? 11 công việc part time lương cao đang chờ bạn",
                description:
                  "Nhân viên part time là gì? Nếu bạn đang quan tâm những vấn đề này thì bài viết dưới đây của Vieclam24h.vn chắc chắn dành cho bạn!",
                image: "https://cdn4.vieclam24h.vn/vie_cc_a3_cc_82c_lam_the_cc_82m_buo_cc_82_cc_89i_to_cc_82i_aa61a95f5e.webp",
                rating: 4,
              },
              {
                id: 2,
                title:
                  "Top 7 việc làm remote phổ biến, đem lại thu nhập tốt hiện nay",
                description:
                  "Làm remote là gì và có những lợi ích nào khi làm việc dưới hình thức remote? Xem ngay bài viết của Vieclam24h để được phổ biến chi tiết nhất!",
                image: "https://lptech.asia/uploads/files/2024/09/08/remote-la-gi-uu-diem-va-nhuoc-diem-c-a-lam-remote.jpg",
                rating: 5,
              },
              {
                id: 2,
                title: "Top việc làm thêm ngoài giờ hành chính lương cao, uy tín",
                description:
                  "Cần lưu ý gì khi tìm việc làm thêm ngoài giờ? Top việc làm thêm ngoài giờ hành chính, lương cao hiện nay là gì?",
                image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2023_11_3_638346181356369639_shipper.jpg",
                rating: 4,
              },
            ].map((article) => (
              <Col key={article.id} xs={24} sm={12} lg={8}>
                <Card
                  className="rounded-xl shadow-md border-gray-100 hover:border-indigo-200 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                      <Link to={`/guides/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button
                        type="link"
                        className="text-indigo-600 p-0 h-auto font-semibold flex items-center"
                      >
                        <Link to={`/guides/${article.id}`}>
                          Đọc thêm <FiArrowRight size={14} className="ml-1" />
                        </Link>
                      </Button>
                      <div className="flex items-center text-amber-500">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <FiStar
                              key={i}
                              size={14}
                              fill={
                                i < article.rating ? "currentColor" : "none"
                              }
                              className={
                                i < article.rating ? "" : "text-gray-300"
                              }
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Jobs by Profession, Location, and New Jobs */}
        <Row gutter={[16, 16]} className="mb-12">
          {/* Jobs by Profession */}
          <Col xs={24} md={8}>
            <Card className="rounded-xl shadow-md border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-center mb-4">
                <FiBriefcase className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">
                  Việc làm theo ngành nghề
                </h3>
              </div>
              <ul className="space-y-3">
                <li
                  onClick={() => handleIndustryChange("")}
                  className={`text-sm text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center group ${
                    filterIndustry === "" ? "text-indigo-600" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2 group-hover:scale-125 transition-transform"></div>
                  <span className="line-clamp-1">Tất cả ngành nghề</span>
                </li>
                {visibleIndustries.map((industry, index) => (
                  <li
                    key={index}
                    onClick={() => handleIndustryChange(industry)}
                    className={`text-sm text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center group ${
                      filterIndustry === industry ? "text-indigo-600" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2 group-hover:scale-125 transition-transform"></div>
                    <span className="line-clamp-1">{industry}</span>
                  </li>
                ))}
              </ul>
              {industries.length > 5 && (
                <Button
                  type="link"
                  onClick={() => setShowAllIndustriesModal(true)}
                  className="text-indigo-600 mt-4 p-0 h-auto font-semibold flex items-center"
                >
                  Hiện tất cả <FiArrowRight size={14} className="ml-1" />
                </Button>
              )}
            </Card>
          </Col>

          {/* Jobs by Location */}
          <Col xs={24} md={8}>
            <Card className="rounded-xl shadow-md border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-center mb-4">
                <FiMapPin className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">
                  Việc làm theo khu vực
                </h3>
              </div>
              <ul className="space-y-3">
                <li
                  onClick={() => handleLocationChange("")}
                  className={`text-sm text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center group ${
                    filterLocation === "" ? "text-indigo-600" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2 group-hover:scale-125 transition-transform"></div>
                  <span className="line-clamp-1">Tất cả tỉnh thành</span>
                </li>
                {visibleProvinces.map((province, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleLocationChange(province.normalizedName)
                    }
                    className={`text-sm text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center group ${
                      filterLocation === province.normalizedName
                        ? "text-indigo-600"
                        : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2 group-hover:scale-125 transition-transform"></div>
                    <span className="line-clamp-1">{province.name}</span>
                  </li>
                ))}
              </ul>
              {provinceOptions.length > 6 && (
                <Button
                  type="link"
                  onClick={() => setShowAllProvincesModal(true)}
                  className="text-indigo-600 mt-4 p-0 h-auto font-semibold flex items-center"
                >
                  Hiện tất cả <FiArrowRight size={14} className="ml-1" />
                </Button>
              )}
            </Card>
          </Col>

          {/* New Job */}
          <Col xs={24} md={8}>
            <Card className="rounded-xl shadow-md border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-center mb-4">
                <FiTrendingUp className="text-indigo-600 mr-2" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">
                  Việc làm mới
                </h3>
              </div>
              <ul className="space-y-3">
                {newJobsLimited.length > 0 ? (
                  newJobsLimited.map((job, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer flex items-center group"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2 group-hover:scale-125 transition-transform"></div>
                      <span className="line-clamp-1">{job.title}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">
                    Không có việc làm mới trong 5 ngày gần đây.
                  </li>
                )}
              </ul>
              <Button
                type="link"
                onClick={() => setShowAllNewJobsModal(true)}
                className="text-indigo-600 mt-4 p-0 h-auto font-semibold flex items-center"
              >
                Hiện tất cả <FiArrowRight size={14} className="ml-1" />
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-10 rounded-2xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bắt đầu sự nghiệp mới của bạn ngay hôm nay
            </h2>
            <p className="text-indigo-200 mb-6 text-lg">
              Hàng ngàn cơ hội việc làm đang chờ đợi bạn
            </p>
            <Button
              type="primary"
              className="bg-white text-indigo-700 hover:bg-indigo-100 font-bold px-10 py-3 h-auto rounded-lg shadow-lg border-0 transform hover:translate-y-[-2px] transition-all duration-300"
              size="large"
            >
              Đăng ký ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
