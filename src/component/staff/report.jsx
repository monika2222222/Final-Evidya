import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Report = () => {
    const navigate = useNavigate();
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [unitTest1, setUnitTest1] = useState([]);
    const [unitTest2, setUnitTest2] = useState([]);
    const [attendance, setAttendance] = useState("");
    const [oralMarks, setOralMarks] = useState("");
    const [submission, setSubmission] = useState(false);
    const [passkey, setPasskey] = useState(""); // ✅ Passkey state

    // ✅ Function to Generate a Random Passkey
    const generatePasskey = () => {
        return Math.random().toString(36).substr(2, 6).toUpperCase(); // 6-character passkey
    };

    // ✅ Fetch Student Info by Enrollment No
    const checkStudent = async () => {
        try {
            const response = await fetch(`http://localhost:5000/getStudent?enrollmentNo=${enrollmentNo}`);

            if (!response.ok) throw new Error("Student not found");

            const student = await response.json();
            setName(student.name);
            setDepartment(student.department);
            setYear(student.year);
        } catch (error) {
            alert("Student not found!");
            setName("");
            setDepartment("");
            setYear("");
        }
    };

    // ✅ Add Subject to Unit Test 1
    const addSubjectUT1 = () => {
        setUnitTest1([...unitTest1, { subject: "", marks: 0 }]);
    };

    // ✅ Add Subject to Unit Test 2
    const addSubjectUT2 = () => {
        setUnitTest2([...unitTest2, { subject: "", marks: 0 }]);
    };

    // ✅ Submit Report with Passkey
    const handleSubmit = async () => {
        const generatedPasskey = generatePasskey(); // Generate passkey
        setPasskey(generatedPasskey);

        try {
            const response = await fetch("http://localhost:5000/saveReport", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enrollmentNo,
                    name,
                    department,
                    year,
                    unitTest1,
                    unitTest2,
                    attendance,
                    oralMarks,
                    submission,
                    passkey: generatedPasskey // ✅ Save passkey in database
                })
            });

            if (!response.ok) throw new Error("Failed to save report");

            alert(`Report saved successfully!\nPasskey: ${generatedPasskey}`); // ✅ Display Passkey
        } catch (error) {
            console.error("Error saving report:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* ✅ Header */}
                <header className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Student Report</h1>
                    <Link to={"/Staff"} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        &#8592; Go Back
                    </Link>
                </header>

                {/* ✅ Search Student by Enrollment No */}
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        placeholder="Enter Enrollment No"
                        className="p-2 border rounded flex-1"
                    />
                    <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={checkStudent}>
                        🔍 Search
                    </button>
                </div>

                {/* ✅ Student Info */}
                {name && (
                    <div className="mb-4 bg-gray-100 p-4 rounded">
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Department:</strong> {department.toUpperCase()}</p>
                        <p><strong>Year:</strong> {year}</p>
                    </div>
                )}

                {/* ✅ Unit Test 1 */}
                <h3 className="text-lg font-semibold mt-4">Unit Test 1</h3>
                {unitTest1.map((item, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={item.subject}
                            onChange={(e) => {
                                let newSubjects = [...unitTest1];
                                newSubjects[index].subject = e.target.value;
                                setUnitTest1(newSubjects);
                            }}
                            placeholder="Subject Name"
                            className="p-2 border rounded flex-1"
                        />
                        <input
                            type="number"
                            value={item.marks}
                            onChange={(e) => {
                                let newSubjects = [...unitTest1];
                                let marks = parseInt(e.target.value, 10);
                                newSubjects[index].marks = marks >= 0 && marks <= 20 ? marks : 20;
                                setUnitTest1(newSubjects);
                            }}
                            placeholder="Marks (Max: 20)"
                            className="p-2 border rounded w-20"
                            min="0"
                            max="20"
                        />
                    </div>
                ))}
                <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={addSubjectUT1}>
                    ➕ Add Subject
                </button>

                {/* ✅ Unit Test 2 */}
                <h3 className="text-lg font-semibold mt-4">Unit Test 2</h3>
                {unitTest2.map((item, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={item.subject}
                            onChange={(e) => {
                                let newSubjects = [...unitTest2];
                                newSubjects[index].subject = e.target.value;
                                setUnitTest2(newSubjects);
                            }}
                            placeholder="Subject Name"
                            className="p-2 border rounded flex-1"
                        />
                        <input
                            type="number"
                            value={item.marks}
                            onChange={(e) => {
                                let newSubjects = [...unitTest2];
                                let marks = parseInt(e.target.value, 10);
                                newSubjects[index].marks = marks >= 0 && marks <= 20 ? marks : 20;
                                setUnitTest2(newSubjects);
                            }}
                            placeholder="Marks (Max: 20)"
                            className="p-2 border rounded w-20"
                            min="0"
                            max="20"
                        />
                    </div>
                ))}
                <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={addSubjectUT2}>
                    ➕ Add Subject
                </button>

                <h3 className="text-lg font-semibold mt-4">Other Details</h3>
                <input
                    type="number"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    placeholder="Average Attendance (%)"
                    className="p-2 border rounded w-full mt-2"
                />
                <input
                    type="number"
                    value={oralMarks}
                    onChange={(e) => setOralMarks(e.target.value)}
                    placeholder="Oral Marks"
                    className="p-2 border rounded w-full mt-2"
                />
                <label className="flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={submission}
                        onChange={() => setSubmission(!submission)}
                        className="mr-2"
                    />
                    Submission Done
                </label>

                {/* ✅ Submit Button */}
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700" onClick={handleSubmit}>
                    Submit Report
                </button>

                {/* ✅ Manage Reports Button */}
                <button
                    className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 ml-2"
                    onClick={() => navigate("/Managereport")}
                >
                    📂 Manage Reports
                </button>
            </div>
        </div>
    );
};

export default Report;
