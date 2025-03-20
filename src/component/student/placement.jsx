import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PlacementPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await fetch("http://localhost:5000/api/placement/jobs");
        const statsRes = await fetch("http://localhost:5000/api/placement/stats");

        setJobs(await jobsRes.json());
        setStats(await statsRes.json());
      } catch (error) {
        console.error("Error fetching placement data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredJobs = jobs.filter(job => (filter === "all" ? true : job.category === filter));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="absolute top-4 right-4 bg-sky-500 text-white px-4 py-2 rounded">
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-600">Placement Portal</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="p-4 bg-blue-100 rounded shadow">
          <h3 className="text-gray-600">Total Placements</h3>
          <p className="text-2xl font-bold">{stats.totalPlacements}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="text-gray-600">Avg Package</h3>
          <p className="text-2xl font-bold">₹{stats.averagePackage} LPA</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h3 className="text-gray-600">Max Package</h3>
          <p className="text-2xl font-bold">₹{stats.highestPackage} LPA</p>
        </div>
      </div>

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(job => (
          <div key={job._id} className="bg-white p-4 rounded shadow-md flex">
            <img
              src={`http://localhost:5000/uploads/${job.studentImage}`}
              alt="Student"
              className="w-16 h-16 rounded-full mr-4"
              onError={(e) => e.target.src = "https://via.placeholder.com/80"} // Fallback if image is missing
            />

            <div>
              <h3 className="text-lg font-bold">{job.title} at {job.companyName}</h3>
              <p>Package: ₹{job.package} LPA</p>
              <p className="text-gray-500">{job.category.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementPortal;
