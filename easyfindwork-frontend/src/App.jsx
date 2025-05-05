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
import SearchPage from "./pages/Search";

function App() {
  return (
    <Routes>
      {/* Từ nhánh HoangThanh */}
      <Route path="/" element={<Home />} />
      <Route path="/job-search" element={<SearchPage />} />

      {/* Từ nhánh main + vinh */}
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/job/:id" element={<JobDetailPage />} />
      <Route path="/company/:id" element={<CompanyDetailPage />} />
      <Route path="/profile" element={<Profile />}>
        <Route index element={<MyProfile />} />
        <Route path="saved-jobs" element={<JobSaved />} />
        <Route path="applied-jobs" element={<AppliedJobs />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
