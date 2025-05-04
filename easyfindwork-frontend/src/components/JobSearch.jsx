
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  FiSearch,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiBriefcase,
  FiMap,
  FiClock,
} from "react-icons/fi"
import { Input, Select, Button, Card, Skeleton, Row, Col } from "antd"

const { Option } = Select

export default function JobSearch() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterProfession, setFilterProfession] = useState("")
  const [filterLocation, setFilterLocation] = useState("")
  const jobsPerPage = 9

  // Fetch jobs and companies using Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [jobsResponse, companiesResponse] = await Promise.all([
          axios.get("http://localhost:3001/jobs"),
          axios.get("http://localhost:3001/companies"),
        ])

        setJobs(jobsResponse.data)
        setFilteredJobs(jobsResponse.data)
        setCompanies(companiesResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("jobFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("jobFavorites", JSON.stringify(favorites))
  }, [favorites])

  // Handle search and filter functionality
  const performSearchAndFilter = () => {
    setCurrentPage(1)
    const keyword = searchQuery.toLowerCase()
    const filtered = jobs.filter((job) => {
      const matchesSearch = keyword ? job.title.toLowerCase().includes(keyword) : true
      const matchesProfession = filterProfession ? job.category === filterProfession : true
      const matchesLocation = filterLocation ? job.location === filterLocation : true
      return matchesSearch && matchesProfession && matchesLocation
    })
    setFilteredJobs(filtered)
  }

  // Handle form submission (button click)
  const handleSubmit = (e) => {
    e.preventDefault()
    performSearchAndFilter()
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      performSearchAndFilter()
    }
  }

  // Toggle favorite status
  const toggleFavorite = (jobId) => {
    setFavorites((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  // Pagination logic
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const visibleJobs = filteredJobs.slice(startIndex, endIndex)

  // Get company logo and name
  const getCompanyLogo = (companyId) => {
    const company = companies.find((c) => c.id === companyId)
    return company?.logo || "/placeholder.svg?height=40&width=40"
  }

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId)
    return company?.name || "Unknown Company"
  }

  // Format salary
  const formatSalary = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Generate days remaining (mocked for now)
  const getDaysRemaining = () => {
    return Math.floor(Math.random() * 30) + 1
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Banner Section */}
      {/* Banner Section */}
<div className="bg-white py-8">
  <div className="container mx-auto px-4">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Tuyển dụng 4.800+ việc làm mới nhất 2025
    </h1>
    <Card className="rounded-xl shadow-lg p-6">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={8}>
          <Input
            prefix={<FiSearch className="text-gray-400" />}
            placeholder="Tìm kiếm việc làm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="py-3 rounded-lg border-gray-300 focus:border-indigo-500 transition-all duration-200"
            aria-label="Tìm kiếm việc làm"
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Ngành nghề"
            onChange={(value) => setFilterProfession(value)}
            className="w-full"
            suffixIcon={<FiBriefcase className="text-gray-400" />}
            aria-label="Lọc theo ngành nghề"
          >
            <Option value="">Tất cả ngành nghề</Option>
            <Option value="marketing">Marketing</Option>
            <Option value="it">Công nghệ thông tin</Option>
            <Option value="sales">Kinh doanh</Option>
            <Option value="design">Thiết kế</Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Select
            placeholder="Khu vực"
            onChange={(value) => setFilterLocation(value)}
            className="w-full"
            suffixIcon={<FiMapPin className="text-gray-400" />}
            aria-label="Lọc theo khu vực"
          >
            <Option value="">Tất cả khu vực</Option>
            <Option value="hanoi">Hà Nội</Option>
            <Option value="hcm">TP.HCM</Option>
            <Option value="danang">Đà Nẵng</Option>
            <Option value="cantho">Cần Thơ</Option>
          </Select>
        </Col>
        <Col xs={24} md={8}>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-lg font-semibold transition-all duration-200"
            aria-label="Tìm kiếm việc làm"
          >
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </Card>
  </div>
</div>
{/* Search Section */}
<div className="bg-purple-800 text-white py-4">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row gap-4 items-center">
      {/* Ô tìm kiếm */}
      <div className="flex-1 bg-white rounded-md flex items-center px-4">
        <FiSearch className="text-gray-400 h-5 w-5 flex-shrink-0" />
        <input
          type="text"
          placeholder="Kế toán"
          className="w-full border-0 focus:ring-0 text-black px-2 py-2"
        />
      </div>

      {/* Lọc theo ngành nghề */}
      <div className="flex-1 bg-white rounded-md flex items-center px-4">
        <Select
          placeholder="Lọc theo nghề nghiệp"
          className="w-full border-0 focus:ring-0"
          suffixIcon={<FiBriefcase className="text-gray-400" />}
        >
          <Option value="">Tất cả ngành nghề</Option>
          <Option value="marketing">Marketing</Option>
          <Option value="it">Công nghệ thông tin</Option>
          <Option value="sales">Kinh doanh</Option>
          <Option value="design">Thiết kế</Option>
        </Select>
      </div>

      {/* Lọc theo tỉnh thành */}
      <div className="flex-1 bg-white rounded-md flex items-center px-4">
        <Select
          placeholder="Lọc theo tỉnh thành"
          className="w-full border-0 focus:ring-0"
          suffixIcon={<FiMapPin className="text-gray-400" />}
        >
          <Option value="">Tất cả tỉnh thành</Option>
          <Option value="hanoi">Hà Nội</Option>
          <Option value="hcm">TP.HCM</Option>
          <Option value="danang">Đà Nẵng</Option>
          <Option value="cantho">Cần Thơ</Option>
        </Select>
      </div>

      {/* Nút tìm kiếm */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
        Tìm kiếm
      </button>

      {/* Nút lọc nâng cao */}
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium">
        Lọc nâng cao
      </button>
    </div>
  </div>
</div>

{/* Advanced Filters */}
<div className="bg-white py-2 border-t">
  <div className="container mx-auto px-4">
    <div className="flex flex-wrap gap-4 items-center">
      {/* Các bộ lọc nâng cao */}
      <button className="text-purple-800 font-medium flex items-center gap-2">
        <FiSearch className="h-4 w-4" />
        Tuyển gấp
      </button>
      <Select placeholder="Tất cả kinh nghiệm" className="w-40">
        <Option value="">Tất cả kinh nghiệm</Option>
        <Option value="0">Không yêu cầu</Option>
        <Option value="1">1 năm</Option>
        <Option value="2">2 năm</Option>
      </Select>
      <Select placeholder="Tất cả mức lương" className="w-40">
        <Option value="">Tất cả mức lương</Option>
        <Option value="5000000">5 triệu</Option>
        <Option value="10000000">10 triệu</Option>
      </Select>
      <Select placeholder="Tất cả cấp bậc" className="w-40">
        <Option value="">Tất cả cấp bậc</Option>
        <Option value="intern">Thực tập sinh</Option>
        <Option value="staff">Nhân viên</Option>
      </Select>
      <Select placeholder="Tất cả trình độ" className="w-40">
        <Option value="">Tất cả trình độ</Option>
        <Option value="highschool">Trung học</Option>
        <Option value="bachelor">Đại học</Option>
      </Select>
      <Select placeholder="Loại công việc" className="w-40">
        <Option value="">Tất cả loại công việc</Option>
        <Option value="fulltime">Toàn thời gian</Option>
        <Option value="parttime">Bán thời gian</Option>
      </Select>
      <Select placeholder="Tất cả giới tính" className="w-40">
        <Option value="">Tất cả giới tính</Option>
        <Option value="male">Nam</Option>
        <Option value="female">Nữ</Option>
      </Select>

      {/* Nút xóa chọn */}
      <button className="text-red-500 hover:underline">Xóa chọn</button>
    </div>
  </div>
</div>


{/* New Section */}
<div className="bg-white py-4">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Trang Chủ / Tuyển Dụng</p>
        <h2 className="text-2xl font-bold text-gray-800">
          Tuyển dụng <span className="text-indigo-600">4,815</span> việc làm mới nhất năm <span className="text-indigo-600">2025</span>
        </h2>
        <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">
          + Lưu tìm kiếm này
        </a>
      </div>
      <div>
        <Button
          type="default"
          className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium"
        >
          Tìm kiếm đã lưu (0)
        </Button>
      </div>
    </div>
  </div>
</div>

{/* Jobs List Section */}
<div className="container mx-auto px-4 py-8">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-800">
      Cơ hội việc làm
    </h2>
    <div className="text-sm text-gray-500">
      Trang {currentPage}/{Math.ceil(filteredJobs.length / jobsPerPage)}
    </div>
  </div>



        {isLoading ? (
          <div className="space-y-6">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="rounded-lg shadow-md">
                  <Skeleton avatar active paragraph={{ rows: 2 }} />
                </Card>
              ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-6" >
            {visibleJobs.map((job) => (
              <Card style={{margin : "10px"}}
                key={job.id}
                className="rounded-lg shadow-md border-gray-200 hover:shadow-lg transition-all duration-200 relative"
                styles={{ body: { padding: "20px", minHeight: "140px" } }}
              >
                <div className="absolute top-4 right-4" >
                  <Button
                    shape="circle"
                    icon={<FiHeart size={16} />}
                    onClick={() => toggleFavorite(job.id)}
                    className={`flex items-center justify-center ${
                      favorites.includes(job.id)
                        ? "bg-red-50 text-red-500"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                    aria-label={
                      favorites.includes(job.id)
                        ? "Xóa khỏi yêu thích"
                        : "Thêm vào yêu thích"
                    }
                  />
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-50 rounded-md flex-shrink-0 overflow-hidden border border-gray-100">
                    <img
                      src={getCompanyLogo(job.companyId)}
                      alt={getCompanyName(job.companyId)}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src = "/placeholder.svg?height=40&width=40")
                      }
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-800 text-base hover:text-indigo-600 transition-colors duration-200">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getCompanyName(job.companyId)}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <FiMapPin size={14} className="mr-1 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock size={14} className="mr-1 text-gray-400" />
                        <span>
                          {formatSalary(job.salaryMin)} -{" "}
                          {formatSalary(job.salaryMax)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Không tìm thấy công việc nào phù hợp với từ khóa "{searchQuery}".
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center items-center mt-8">
            <Button
              icon={<FiChevronLeft size={20} />}
              disabled={currentPage === 1}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`rounded-full ${
                currentPage === 1
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              aria-label="Trang trước"
            />
            <div className="mx-4 text-gray-600">
              {currentPage} / {Math.ceil(filteredJobs.length / jobsPerPage)}
            </div>
            <Button
              icon={<FiChevronRight size={20} />}
              disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
              onClick={() =>
                currentPage < Math.ceil(filteredJobs.length / jobsPerPage) &&
                setCurrentPage(currentPage + 1)
              }
              className={`rounded-full ${
                currentPage === Math.ceil(filteredJobs.length / jobsPerPage)
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              aria-label="Trang sau"
            />
          </div>
        )}
      </div>

      {/* Featured Jobs */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Việc làm nổi bật
        </h2>
        <Row gutter={[24, 24]}>
          {jobs.slice(0, 6).map((job) => (
            <Col key={job.id} xs={24} sm={12}>
              <Card
                className="rounded-lg shadow-md border-gray-200 hover:shadow-lg transition-all duration-200"
                styles={{ body: { padding: "20px", minHeight: "140px" } }}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-50 rounded-md flex-shrink-0 overflow-hidden border border-gray-100">
                    <img
                      src={getCompanyLogo(job.companyId)}
                      alt={getCompanyName(job.companyId)}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src = "/placeholder.svg?height=40&width=40")
                      }
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    {job.salaryMin && job.salaryMax && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                      </p>
                    )}
                    <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                      <div className="flex items-center">
                        <FiMapPin size={12} className="mr-1 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock size={12} className="mr-1 text-gray-400" />
                        <span>Còn {getDaysRemaining()} ngày</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer */}
      <div className="bg-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4">Việc làm theo ngành nghề</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Hành chính - Thư ký",
                  "An ninh - Bảo vệ",
                  "Thiết kế - Sáng tạo nghệ thuật",
                  "Kiến trúc - Thiết kế nội ngoại thất",
                  "Khách sạn - Nhà hàng - Du lịch",
                ].map((item, index) => (
                  <li key={index}>
                    <Link to="/jobs-by-category" className="hover:text-indigo-300 transition-colors duration-200">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4">Việc làm theo khu vực</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Toàn quốc",
                  "Hà Nội",
                  "TP.HCM",
                  "An Giang",
                  "Bà Rịa - Vũng Tàu",
                ].map((item, index) => (
                  <li key={index}>
                    <Link to="/jobs-by-location" className="hover:text-indigo-300 transition-colors duration-200">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4">Việc làm theo tỉnh thành</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Hà Nội",
                  "TP.HCM",
                  "Đà Nẵng",
                  "Cần Thơ",
                  "Nha Trang",
                ].map((item, index) => (
                  <li key={index}>
                    <Link to="/jobs-by-location" className="hover:text-indigo-300 transition-colors duration-200">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-sm">
                <li>HCM: (028) 7309 2434</li>
                <li>Hà Nội: (024) 7309 2434</li>
                <li>Email: info@vieclam24h.vn</li>
                <li>Đăng ký nhận việc làm mới</li>
              </ul>
            </Col>
          </Row>
          <div className="mt-8 text-center text-sm">
            <p>© 2025 Vieclam24h.vn - Tìm việc làm nhanh, hiệu quả</p>
          </div>
        </div>
      </div>
    </div>
  )
}
