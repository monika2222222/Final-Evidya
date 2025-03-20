import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Top Navbar */}
      <div className="flex bg-slate-900 h-[10vh] w-full justify-between px-4 items-center">
        {/* Menu Button on Left Side */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl"
          whileTap={{ scale: 0.9 }}
        >
          <FaBars />
        </motion.button>
        
        {/* Welcome User on Right Side */}
        <div className="flex items-center">
          <h1 className="font-bold text-xl text-white">WELCOME!!</h1>
          <div className="h-[6vh] w-[3vw] flex justify-center bg-slate-400 rounded-full overflow-hidden ml-3">
            <img src="https://i.ibb.co/vYhTFh4/E-Back-Logo.png" alt="E-Vidya Logo" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Sidebar Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 left-0 h-full bg-gray-800 w-64 z-50 p-4 flex flex-col justify-between shadow-lg"
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-2xl font-bold">Menu</h2>
            <motion.button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl"
              whileTap={{ scale: 0.8 }}
            >
              <FaTimes />
            </motion.button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link to="/Access" className="text-white text-lg hover:text-gray-300">Manage Access</Link>
            <Link to="/Scholarship" className="text-white text-lg hover:text-gray-300">Fees Status</Link>
            <Link to="/Record" className="text-white text-lg hover:text-gray-300">Students Data</Link>
            <Link to="/Announcement" className="text-white text-lg hover:text-gray-300">Announcements</Link>
            <Link to="/Material" className="text-white text-lg hover:text-gray-300">Study Material</Link>
            <Link to="/Report" className="text-white text-lg hover:text-gray-300">Student Report</Link>
          </nav>
        </div>
        <div className="mt-auto border-t border-gray-600 pt-4">
          <Link to="/" className="text-red-400 text-lg hover:text-red-600 block">Log Out</Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-[90vh] w-full px-10"
      >
        {/* Image Section - Enlarged */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-2/3 flex justify-center"
        >
          <img
            src="https://i.postimg.cc/gjQcSpv2/E-Logo2.png"
            alt="E-Vidya"
            className="h-[70vh] object-contain"
          />
        </motion.div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-1.7/3 pl-10 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800">Welcome to E-Vidya</h2>
          <p className="text-lg text-gray-600 mt-4">E-Vidya is a modern educational platform that helps students and staff manage academic resources efficiently. Get access to study materials, announcements, student reports, and more.</p>
          <Link to="/Explore" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Explore Now</Link>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-100 py-16 px-10 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800">About E-Vidya</h2>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          E-Vidya is an innovative online platform dedicated to providing students and educators with seamless access to academic resources. Our mission is to enhance learning experiences through digital solutions, making education more accessible and efficient. Whether it's study materials, progress tracking, or announcements, E-Vidya simplifies academic management.
        </p>
      </motion.div>
    </div>
  );
}