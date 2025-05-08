import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import JobDetailPage from "./pages/JobDetailPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyProfile from "./pages/Profile/MyProfile";
import JobSaved from "./pages/Profile/JobSaved";
import AppliedJobs from "./pages/Profile/AppliedJobs";
import AccountManagement from "./pages/Profile/AccountManagement";
import SearchPage from "./pages/Search";
import PartTimeGuide from "./pages/posts/PartTimeGuide";
import RemoteJobsGuide from "./pages/posts/RemoteJobsGuide";
import ExtraJobsGuide from "./pages/posts/ExtraJobsGuide";
import LayoutDefault from "./pages/LayoutDefault";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  // Nếu đã đăng nhập, lấy thông tin người dùng từ localStorage và cập nhật vào Redux store
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then((res) => res.json())
        .then((user) => {
          dispatch({ type: "SET_USER", user });
        })
        .catch((err) => {
          console.error("Lỗi lấy user:", err);
          localStorage.removeItem("userId");
          dispatch({ type: "LOGOUT" });
        });
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<LayoutDefault />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="job-search" element={<SearchPage />} />
        <Route path="search" element={<Search />} />
        <Route path="job/:id" element={<JobDetailPage />} />
        <Route path="company/:id" element={<CompanyDetailPage />} />
        <Route path="guides/1" element={<PartTimeGuide />} />
        <Route path="guides/2" element={<RemoteJobsGuide />} />
        <Route path="guides/3" element={<ExtraJobsGuide />} />
        <Route path="profile" element={<Profile />}>
          <Route index element={<MyProfile />} />
          <Route path="saved-jobs" element={<JobSaved />} />
          <Route path="applied-jobs" element={<AppliedJobs />} />
          {/* Dùng AccountManagement nếu đã chỉnh sửa logic, nếu không thì Account */}
          <Route path="account" element={<AccountManagement />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
