import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scale, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import swatchbharat from "../assets/swach-bharat.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Notices", path: "/notices" },
    { name: "Members List", path: "/members" },
    { name: "Commissioner List", path: "/commissioners" },
  ];

  const handleAdminClick = () => {
    if (token) {
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Scale className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tighter text-zinc-900 leading-none">
              DRT ADVOCATES
            </span>
            <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase leading-none mt-1">
              Association Hyderabad
            </span>
          </div>
          <div className="flex gap-2">
            <img src={swatchbharat} alt="swach bharat" className="h-14"/>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? "text-primary border-b-2 border-primary" : "text-zinc-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <Button
            onClick={handleAdminClick}
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 flex items-center gap-2"
          >
            {token ? (
              <>
                <LayoutDashboard size={16} />
                Dashboard
              </>
            ) : (
              <>
                <LogIn size={16} />
                Admin Login
              </>
            )}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-zinc-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-zinc-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg font-medium py-2 transition-colors ${
                    location.pathname === link.path ? "text-primary" : "text-zinc-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-zinc-100 my-2" />
              <Button
                onClick={() => {
                  handleAdminClick();
                  setIsOpen(false);
                }}
                className="bg-primary hover:bg-primary/90 text-white w-full py-6 text-lg"
              >
                {token ? "Dashboard" : "Admin Login"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
