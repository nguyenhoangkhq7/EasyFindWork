import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import JobDetail from "./pages/JobDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import MyProfile from "./pages/Profile/MyProfile";
import JobSaved from "./pages/Profile/JobSaved";

function App() {
  return (

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/search" element={<Search />} />
  <Route path="/job/:id" element={<JobDetail />} />
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
