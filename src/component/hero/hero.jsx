import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const hero = () => {
    const [showStudentLogin, setShowStudentLogin] = useState(false);
    const [showStaffLogin, setShowStaffLogin] = useState(false);
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showRequestButton, setShowRequestButton] = useState(false);
    const navigate = useNavigate();

    // ✅ Student Login Function
    const handleStudentLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/studentLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollmentNo }),
            });

            const data = await response.json();
            setMessage(data.message);

            if (data.message === "Login successful!") {
                localStorage.setItem("enrollmentNo",data.enrollment);
                navigate("/Student");
            } else if (data.message === "Not Approved") {
                setShowRequestButton(!data.requestSent); // Show request button only if request not sent
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    // ✅ Send Request to Staff
    const handleSendRequest = async () => {
        try {
            const response = await fetch("http://localhost:5000/sendRequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enrollmentNo }),
            });

            const data = await response.json();
            setMessage(data.message);
            setShowRequestButton(false); // Hide request button after sending
        } catch (error) {
            console.error("Request Error:", error);
        }
    };

    // ✅ Staff Login
const handleAdminStaffLogin = async () => {
    try {
        const response = await fetch("http://localhost:5000/staffLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        setMessage(data.message);

        if (data.success) {
            navigate("/Staff");
        } else {
            setMessage("Invalid Username, Password, or Not Approved by Admin");
        }
    } catch (error) {
        console.error("Staff Login Error:", error);
        setMessage("Server Error! Try again later.");
    }
};


    // ✅ Admin Login
    const handleAdminLogin = () => {
        navigate("/Login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-blue-500 relative">
            
            {/* ✅ Admin Login Button */}
            <button 
                className="absolute top-4 right-4 w-12 h-12 bg-green-500 text-white rounded-full shadow-lg"
                onClick={handleAdminLogin}
            >
                <i class="fa-solid fa-user-tie"></i>
            </button>

            {/* ✅ Main Login Options */}
            <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
                <h1 className="text-2xl font-bold mb-4">E-Vidya Login</h1>

                {/* Student Login Button */}
                <button 
                    onClick={() => setShowStudentLogin(true)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-3"
                >
                    Student Login
                </button>

                {/* Staff Login Button */}
                <button 
                    onClick={() => setShowStaffLogin(true)} 
                    className="bg-green-500 text-white px-4 py-2 rounded w-full"
                >
                    Staff Login
                </button>
            </div>

            {/* ✅ Student Login Modal */}
            {showStudentLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                        <h2 className="text-xl font-bold mb-3">Student Login</h2>
                        <input
                            type="text"
                            placeholder="Enter Enrollment No"
                            value={enrollmentNo}
                            onChange={(e) => setEnrollmentNo(e.target.value)}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <button onClick={handleStudentLogin} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                            Login
                        </button>
                        
                        {/* ✅ Show "Send Request" Button if Not Approved */}
                        {showRequestButton && (
                            <button 
                                onClick={handleSendRequest} 
                                className="bg-yellow-500 text-white px-4 py-2 rounded w-full mt-2"
                            >
                                Want to send request?
                            </button>
                        )}

                        <button onClick={() => setShowStudentLogin(false)} className="text-red-500 mt-2">
                            Close
                        </button>
                        <p className="text-red-600 mt-2">{message}</p>
                    </div>
                </div>
            )}
{/* ✅ Staff Login Modal */}
{showStaffLogin && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-3">Staff Login</h2>
            <p className="text-gray-600 mb-2">Only staff members added by Admin can log in.</p>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 rounded w-full mb-2"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full mb-2"
            />
            <button onClick={handleAdminStaffLogin} className="bg-green-500 text-white px-4 py-2 rounded w-full">
                Login
            </button>
            <button onClick={() => setShowStaffLogin(false)} className="text-red-500 mt-2">
                Close
            </button>
            <p className="text-red-600 mt-2">{message}</p>
        </div>
    </div>
)}

        </div>
    );
};

export default hero;