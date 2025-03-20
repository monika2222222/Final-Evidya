import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Record() {
    const [name, setName] = useState("");
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [division, setDivision] = useState("");
    const [students, setStudents] = useState([]);
    const [searchBy, setSearchBy] = useState("name");
    const [searchValue, setSearchValue] = useState("");
    const [showExport, setShowExport] = useState(false);

    // ✅ Fetch Students from Database
    const fetchStudents = async () => {
        try {
            const response = await fetch(`http://localhost:5000/students?searchBy=${searchBy}&searchValue=${searchValue}`);
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("❌ Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ✅ Add Student & Update List
    const addStudent = async () => {
        try {
            const response = await fetch("http://localhost:5000/addStudent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, enrollmentNo, department, year, division })
            });

            if (!response.ok) throw new Error("Failed to add student");

            setName(""); setEnrollmentNo(""); setDepartment(""); setYear(""); setDivision("");
            fetchStudents();  // ✅ Fetch the updated list
        } catch (error) {
            console.error("❌ Add Student Error:", error);
        }
    };

    // ✅ Edit Student & Update List
    const editStudent = async (id) => {
        const newName = prompt("Enter new name:");
        const newEnrollmentNo = prompt("Enter new enrollment number:");
        const newDepartment = prompt("Enter new department:");
        const newYear = prompt("Enter new year:");
        const newDivision = prompt("Enter new division:");

        if (newName && newEnrollmentNo && newDepartment && newYear && newDivision) {
            try {
                await fetch(`http://localhost:5000/editStudent/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName, enrollmentNo: newEnrollmentNo, department: newDepartment, year: newYear, division: newDivision })
                });

                fetchStudents(); // ✅ Refresh UI after edit
            } catch (error) {
                console.error("❌ Edit Student Error:", error);
            }
        }
    };

    // ✅ Delete Student & Update List
    const deleteStudent = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await fetch(`http://localhost:5000/deleteStudent/${id}`, { method: "DELETE" });
                fetchStudents();  // ✅ Refresh UI after deletion
            } catch (error) {
                console.error("❌ Delete Student Error:", error);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* ✅ "Go Back" Button */}
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold">Student Management</h1>
                <Link to={"/Staff"} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                    &#8592; Go Back
                </Link>
            </div>

            {/* ✅ Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2 mb-4">
                <select className="p-2 border rounded" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="name">Search by Name</option>
                    <option value="enrollmentNo">Search by Enrollment No</option>
                </select>
                <input className="p-2 border rounded flex-1" type="text" placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={fetchStudents}>🔍 Search</button>
            </div>

            {/* ✅ Add Student Form */}
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
                <input className="p-2 border rounded flex-1" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="p-2 border rounded flex-1" type="text" placeholder="Enrollment No" value={enrollmentNo} onChange={(e) => setEnrollmentNo(e.target.value)} />

                <select className="p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">Department</option>
                    <option value="co">Computer</option>
                    <option value="entc">ENTC</option>
                    <option value="mech">Mechanical</option>
                    <option value="civil">Civil</option>
                    <option value="it">IT</option>
                </select>

                <select className="p-2 border rounded" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Year</option>
                    <option value="first">First</option>
                    <option value="second">Second</option>
                    <option value="third">Third</option>
                </select>

                <select className="p-2 border rounded" value={division} onChange={(e) => setDivision(e.target.value)}>
                    <option value="">Division</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>

                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition" onClick={addStudent}>➕ Add</button>
            </div>

            {/* ✅ Student List with Edit & Delete */}
            <h2 className="text-2xl font-semibold mt-6">Added Students</h2>
            <ul className="mt-4">
                {students.map(student => (
                    <li key={student._id} className="p-2 bg-white rounded shadow my-2 flex justify-between">
                        <span>{student.name} ({student.enrollmentNo}) - {student.department?.toUpperCase()} / {student.year} / {student.division}</span>
                        <div>
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600" onClick={() => editStudent(student._id)}>✏️ Edit</button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => deleteStudent(student._id)}>🗑️ Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
