import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import JobDetailPage from "./pages/JobDetailPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/company/:id" element={<CompanyDetailPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
