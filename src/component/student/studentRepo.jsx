import React, { useState } from "react";

const ViewReport = () => {
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [passkey, setPasskey] = useState("");
    const [report, setReport] = useState(null);

    // ✅ Fetch Report using Enrollment No & Passkey
    const fetchReport = async () => {
        try {
            const response = await fetch(`http://localhost:5000/getReport?enrollmentNo=${enrollmentNo}&passkey=${passkey}`);
            if (!response.ok) throw new Error("Invalid Credentials");

            const data = await response.json();
            setReport(data);
        } catch (error) {
            alert("Incorrect Enrollment Number or Passkey!");
            setReport(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4">View Report</h1>

                <input
                    type="text"
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    placeholder="Enter Enrollment No"
                    className="p-2 border rounded w-full mb-2"
                />
                <input
                    type="text"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter Passkey"
                    className="p-2 border rounded w-full mb-2"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={fetchReport}>
                    🔍 View Report
                </button>

                {report && (
                    <div className="mt-4 bg-gray-100 p-4 rounded">
                        <p><strong>Name:</strong> {report.name}</p>
                        <p><strong>Department:</strong> {report.department.toUpperCase()}</p>
                        <p><strong>Year:</strong> {report.year}</p>
                        <p><strong>Attendance:</strong> {report.attendance}%</p>
                        <p><strong>Oral Marks:</strong> {report.oralMarks}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewReport;
