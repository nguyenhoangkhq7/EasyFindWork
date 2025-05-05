import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import JobDetail from "./pages/JobDetail"; // từ nhánh vinh
import JobDetailPage from "./pages/JobDetailPage"; // từ nhánh main
import CompanyDetailPage from "./pages/CompanyDetailPage"; // từ nhánh main
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyProfile from "./pages/Profile/MyProfile";
import JobSaved from "./pages/Profile/JobSaved";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/job/:id" element={<JobDetail />} /> {/* dùng của vinh */}
      <Route path="/job-detail/:id" element={<JobDetailPage />} /> {/* dùng của main, thêm path riêng nếu cần */}
      <Route path="/company/:id" element={<CompanyDetailPage />} />
      <Route path="/profile" element={<Profile />}>
        <Route index element={<MyProfile />} />
        <Route path="job-saved" element={<JobSaved />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
