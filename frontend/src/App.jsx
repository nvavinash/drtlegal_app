import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Notices from "./pages/Notices";
import Members from "./pages/Members";
import Commissioners from "./pages/Commissioners";
import About from "./pages/About";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/members" element={<Members />} />
        <Route path="/commissioners" element={<Commissioners />} />
        <Route path="/about" element={<About />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
