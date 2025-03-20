import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const [staffs, setStaffs] = useState([]);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    
    const navigate = useNavigate(); // ✅ Navigation Hook

    // ✅ Fetch Staff Members
    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/getStaffs");
            setStaffs(response.data);
        } catch (error) {
            console.error("Error fetching staffs:", error);
        }
    };

    // ✅ Generate Random Username & Password
    const generateCredentials = (name) => {
        const username = name.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 1000);
        const password = Math.random().toString(36).slice(-8);
        return { username, password };
    };

    // ✅ Add Staff Member
    const handleAddStaff = async () => {
        const { username, password } = generateCredentials(name);

        try {
            await axios.post("http://localhost:5000/addStaff", {
                name, mobile, address, email, subject, username, password
            });

            setName(""); setMobile(""); setAddress(""); setEmail(""); setSubject("");
            fetchStaffs();  // Refresh Staff List
        } catch (error) {
            console.error("Error adding staff:", error);
        }
    };

    // ✅ Delete Staff Member
    const handleDeleteStaff = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/deleteStaff/${id}`);
            fetchStaffs();
        } catch (error) {
            console.error("Error deleting staff:", error);
        }
    };

    // ✅ Handle Logout
    const handleLogout = () => {
        navigate("/"); // Redirect to Hero page
    };

    return (
        <div className="flex h-screen">
            {/* ✅ Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-5 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
                    <ul>
                        <li className="mb-3">
                            <a href="#" className="block p-2 bg-gray-700 rounded">Manage Staff</a>
                        </li>
                        <li className="mb-3">
                            <Link to="/Updatep" className="block p-2 bg-gray-700 rounded">Placement Portal</Link>
                        </li>
                    </ul>
                </div>

                {/* ✅ Logout Button at Bottom */}
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 text-white px-4 py-2 rounded w-full mt-auto"
                >
                    Logout
                </button>
            </div>

            {/* ✅ Main Content */}
            <div className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-6">Manage Staff</h2>

                {/* ✅ Add Staff Form */}
                <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4">Add Staff</h3>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full mb-2" />
                    <input type="text" placeholder="Mobile No" value={mobile} onChange={(e) => setMobile(e.target.value)}
                        className="border p-2 rounded w-full mb-2" />
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}
                        className="border p-2 rounded w-full mb-2" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded w-full mb-2" />
                    <input type="text" placeholder="Teaching Subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                        className="border p-2 rounded w-full mb-2" />
                    <button onClick={handleAddStaff} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                        Add Staff
                    </button>
                </div>

                {/* ✅ Staff List */}
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Staff List</h3>
                    {staffs.length === 0 ? (
                        <p>No staff members added yet.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Mobile</th>
                                    <th className="border p-2">Username</th>
                                    <th className="border p-2">Password</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffs.map((staff) => (
                                    <tr key={staff._id} className="text-center">
                                        <td className="border p-2">{staff.name}</td>
                                        <td className="border p-2">{staff.mobile}</td>
                                        <td className="border p-2">{staff.username}</td>
                                        <td className="border p-2">{staff.password}</td>
                                        <td className="border p-2">
                                            <button onClick={() => handleDeleteStaff(staff._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
