import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Search from "./pages/Search";
// import JobDetail from "./pages/JobDetail";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import JobPortal from "./components/JobPortal";
import JobSearch from "./components/JobSearch";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<JobPortal />} />
        <Route path="/job-search" element={<JobSearch />} />

    {/* //     <Route path="/search" element={<Search />} />
    //     <Route path="/job/:id" element={<JobDetail />} />
    //     <Route path="/profile" element={<Profile />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );

}

export default App;
