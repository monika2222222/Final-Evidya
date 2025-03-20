import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FeeScholarshipPage = () => {
    const [students, setStudents] = useState([]);
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [division, setDivision] = useState("");

    // ✅ Fetch students based on filters
    const fetchStudents = async () => {
        if (!department || !year || !division) return; // Ensures all dropdowns are selected before fetching

        try {
            const response = await fetch(
                `http://localhost:5000/students?department=${department}&year=${year}&division=${division}`
            );
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [department, year, division]); // Trigger fetch when any filter changes

    // ✅ Toggle Fee Status
    const toggleFeeStatus = async (id, currentStatus) => {
        try {
            const updatedStatus = !currentStatus;  // ✅ Toggle current status

            const response = await fetch(`http://localhost:5000/updateFeeStatus/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fees: updatedStatus }) // ✅ Send updated fees status
            });

            if (!response.ok) {
                throw new Error("Failed to update fee status");
            }

            // ✅ Refresh student list after update
            fetchStudents();
        } catch (error) {
            console.error("Error updating fee status:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold">Student Fee status</h1>
                    <Link to={"/Staff"} className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
                        &#8592; Go Back
                    </Link>
                </header>

                <main className="p-6">
                    {/* Filters */}
                    <div className="flex gap-4 mb-4">
                        <select className="p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option value="">Select Department</option>
                            <option value="co">Computer</option>
                            <option value="entc">ENTC</option>
                            <option value="mech">Mechanical</option>
                            <option value="civil">Civil</option>
                            <option value="it">IT</option>
                        </select>

                        <select className="p-2 border rounded" value={year} onChange={(e) => setYear(e.target.value)}>
                            <option value="">Select Year</option>
                            <option value="first">First Year</option>
                            <option value="second">Second Year</option>
                            <option value="third">Third Year</option>
                        </select>

                        <select className="p-2 border rounded" value={division} onChange={(e) => setDivision(e.target.value)}>
                            <option value="">Select Division</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>

                       
                    </div>

                    {/* Table for displaying students' fee and scholarship status */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Student Details</h2>
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Student Name</th>
                                    <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Enrollment No.</th>
                                    <th className="py-2 px-4 text-left font-medium text-gray-600 border-b">Fee Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <tr key={student._id} className="border-b">
                                            <td className="py-2 px-4">{student.name}</td>
                                            <td className="py-2 px-4">{student.enrollmentNo}</td>
                                            <td className="py-2 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={student.fees}  // ✅ Controlled by database value
                                                    onChange={() => toggleFeeStatus(student._id, student.fees)}
                                                />
                                            </td>

                                           
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-gray-500">No students found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default FeeScholarshipPage;
