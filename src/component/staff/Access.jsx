import React, { useEffect, useState } from "react";

const Access = () => {
    const [pendingRequests, setPendingRequests] = useState([]);

    // ✅ Fetch Pending Requests
    useEffect(() => {
        fetch("http://localhost:5000/pendingRequests")
            .then((res) => res.json())
            .then((data) => setPendingRequests(data))
            .catch((err) => console.error("Error fetching requests:", err));
    }, []);

    // ✅ Approve Student
    const approveStudent = async (enrollmentNo) => {
        await fetch("http://localhost:5000/approveStudent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enrollmentNo }),
        });

        // ✅ Update UI
        setPendingRequests(prevRequests => prevRequests.filter(student => student.enrollmentNo !== enrollmentNo));

    };

    // ✅ Reject Student
    const rejectStudent = async (enrollmentNo) => {
        await fetch("http://localhost:5000/rejectStudent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enrollmentNo }),
        });

        // ✅ Update UI
        setPendingRequests(pendingRequests.filter(student => student.enrollmentNo !== enrollmentNo));
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-200 p-6">
            <h1 className="text-2xl font-bold mb-6">Pending Student Requests</h1>

            {pendingRequests.length === 0 ? (
                <p className="text-gray-600">No pending requests</p>
            ) : (
                <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg">
                    {pendingRequests.map((student) => (
                        <div key={student.enrollmentNo} className="flex justify-between items-center border-b p-3">
                            <span className="text-lg">{student.enrollmentNo}</span>
                            <div>
                                <button 
                                    onClick={() => approveStudent(student.enrollmentNo)} 
                                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => rejectStudent(student.enrollmentNo)} 
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Access;
