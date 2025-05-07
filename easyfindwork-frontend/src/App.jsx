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
import Account from "./pages/Profile/Account";
import AccountManagement from "./pages/Profile/AccountManagement";
import SearchPage from "./pages/Search";
import PartTimeGuide from "./pages/posts/PartTimeGuide";
import RemoteJobsGuide from "./pages/posts/RemoteJobsGuide";
import ExtraJobsGuide from "./pages/posts/ExtraJobsGuide";
import LayoutDefault from "./pages/LayoutDefault";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutDefault />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="job-search" element={<SearchPage />} />
        <Route path="search" element={<Search />} />
        <Route path="job/:id" element={<JobDetailPage />} />
        <Route path="company/:id" element={<CompanyDetailPage />} />
        <Route path="guides/part-time-guide" element={<PartTimeGuide />} />
        <Route path="guides/remote-job-guide" element={<RemoteJobsGuide />} />
        <Route path="guides/extra-job-guide" element={<ExtraJobsGuide />} />
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
