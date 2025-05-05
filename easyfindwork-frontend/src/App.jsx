import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import JobDetail from "./pages/JobDetail";
import JobDetailPage from "./pages/JobDetailPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyProfile from "./pages/Profile/MyProfile";
import JobSaved from "./pages/Profile/JobSaved";
import JobPortal from "./components/JobPortal";
import JobSearch from "./components/JobSearch";

function App() {
  return (
    <Router>
      <Routes>
        {/* Từ nhánh HoangThanh */}
        <Route path="/" element={<JobPortal />} />
        <Route path="/job-search" element={<JobSearch />} />

        {/* Từ nhánh main + vinh */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/job-detail/:id" element={<JobDetailPage />} />
        <Route path="/company/:id" element={<CompanyDetailPage />} />
        <Route path="/profile" element={<Profile />}>
          <Route index element={<MyProfile />} />
          <Route path="job-saved" element={<JobSaved />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
