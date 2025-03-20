import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");

    // ✅ Fetch Reports
    const fetchReports = async () => {
        if (!department || !year) return;
        try {
            const response = await fetch(`http://localhost:5000/reports?department=${department}&year=${year}`);
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    // ✅ Edit Report (Edit Unit Test Marks)
    const editReport = async (id) => {
        const updatedReport = reports.find((r) => r._id === id);

        // Prompt for UT1 & UT2 marks
        const newUT1Marks = updatedReport.unitTest1.map((subject) => ({
            subject: subject.subject,
            marks: parseInt(prompt(`Enter new marks for ${subject.subject} (UT1):`, subject.marks), 10) || subject.marks
        }));

        const newUT2Marks = updatedReport.unitTest2.map((subject) => ({
            subject: subject.subject,
            marks: parseInt(prompt(`Enter new marks for ${subject.subject} (UT2):`, subject.marks), 10) || subject.marks
        }));

        try {
            await fetch(`http://localhost:5000/editReport/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ unitTest1: newUT1Marks, unitTest2: newUT2Marks })
            });
            fetchReports();
        } catch (error) {
            console.error("Error editing report:", error);
        }
    };

    // ✅ Delete Report
    const deleteReport = async (id) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await fetch(`http://localhost:5000/deleteReport/${id}`, { method: "DELETE" });
                fetchReports();
            } catch (error) {
                console.error("Error deleting report:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* ✅ Header */}
                <header className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Manage Reports</h1>
                    <Link to={"/Report"} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        &#8592; Go Back
                    </Link>
                </header>

                {/* ✅ Filters */}
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

                    <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={fetchReports}>
                        🔍 Fetch Reports
                    </button>
                </div>

                {/* ✅ Reports List */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Student Reports</h2>
                    {reports.length > 0 ? (
                        <ul className="space-y-4">
                            {reports.map((report) => (
                                <li key={report._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <p className="font-medium text-blue-600">{report.name} ({report.enrollmentNo})</p>
                                    <p className="text-gray-500">Attendance: {report.attendance}%</p>
                                    <p className="text-gray-500">Oral Marks: {report.oralMarks}</p>
                                    <p className="text-gray-500">
                                        <strong>Passkey:</strong> <span className="text-red-600 font-semibold">{report.passkey || "N/A"}</span>
                                    </p>


                                    {/* ✅ Unit Test 1 & 2 */}
                                    <div className="mt-2">
                                        <p className="font-semibold text-gray-700">Unit Test 1</p>
                                        <ul className="ml-4 list-disc">
                                            {report.unitTest1.map((subject, index) => (
                                                <li key={index}>{subject.subject}: {subject.marks}/20</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-2">
                                        <p className="font-semibold text-gray-700">Unit Test 2</p>
                                        <ul className="ml-4 list-disc">
                                            {report.unitTest2.map((subject, index) => (
                                                <li key={index}>{subject.subject}: {subject.marks}/20</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* ✅ Edit & Delete Buttons */}
                                    <div className="mt-2">
                                        <button
                                            className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600"
                                            onClick={() => editReport(report._id)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => deleteReport(report._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No reports found.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ManageReports;
