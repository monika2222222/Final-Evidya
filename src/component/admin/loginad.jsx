import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      navigate("/admin"); // Redirect to admin page
    } else {
      setError("Incorrect password! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Admin Login
        </h2>

        {/* ✅ Password Input */}
        <form onSubmit={handleLogin} className="flex flex-col">
          <label className="text-gray-700 font-medium">Enter Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 p-2 border rounded-lg focus:ring focus:ring-blue-300"
            placeholder="Enter admin password"
          />

          {/* ✅ Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* ✅ Login Button */}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* ✅ Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full"
        >
          &#8592; Go Back
        </button>
      </div>
    </div>
  );
};

export default Login;
