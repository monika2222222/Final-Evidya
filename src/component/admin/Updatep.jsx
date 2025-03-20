import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdatePlacement = () => {
  const [stats, setStats] = useState({ totalPlacements: 0, averagePackage: 0, highestPackage: 0 });
  const [placements, setPlacements] = useState([]);
  const [filter, setFilter] = useState("all");
  const [placement, setPlacement] = useState({
    studentName: "",
    companyName: "",
    title: "",
    package: "",
    category: "technical",
    studentImage: null, // File Upload
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const jobsRes = await fetch(`http://localhost:5000/api/placement/jobs?category=${filter}`);
      const statsRes = await fetch("http://localhost:5000/api/placement/stats");

      setPlacements(await jobsRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleImageUpload = (e) => {
    setPlacement({ ...placement, studentImage: e.target.files[0] });
  };

  const addPlacement = async () => {
    const formData = new FormData();
    formData.append("studentName", placement.studentName);
    formData.append("companyName", placement.companyName);
    formData.append("title", placement.title);
    formData.append("package", placement.package);
    formData.append("category", placement.category);
    formData.append("studentImage", placement.studentImage);

    try {
      await fetch("http://localhost:5000/api/placement/jobs", {
        method: "POST",
        body: formData,
      });

      alert("Placement added successfully!");
      fetchData();
    } catch (error) {
      console.error("Error adding placement:", error);
    }
  };

  const deletePlacement = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/placement/jobs/${id}`, { method: "DELETE" });
      alert("Placement deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting placement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="absolute top-4 right-4 bg-sky-500 text-white px-4 py-2 rounded">
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-blue-600">Update Placement</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="p-4 bg-blue-100 rounded shadow"><h3>Total Placements</h3><p>{stats.totalPlacements}</p></div>
        <div className="p-4 bg-green-100 rounded shadow"><h3>Avg Package</h3><p>₹{stats.averagePackage} LPA</p></div>
        <div className="p-4 bg-yellow-100 rounded shadow"><h3>Max Package</h3><p>₹{stats.highestPackage} LPA</p></div>
      </div>

      {/* Add New Placement */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Add New Placement</h2>
        <input type="text" placeholder="Student Name" className="border p-2 w-full mb-2"
          onChange={(e) => setPlacement({ ...placement, studentName: e.target.value })} />
        <input type="text" placeholder="Company Name" className="border p-2 w-full mb-2"
          onChange={(e) => setPlacement({ ...placement, companyName: e.target.value })} />
        <input type="text" placeholder="Job Title" className="border p-2 w-full mb-2"
          onChange={(e) => setPlacement({ ...placement, title: e.target.value })} />
        <input type="number" placeholder="Package (LPA)" className="border p-2 w-full mb-2"
          onChange={(e) => setPlacement({ ...placement, package: e.target.value })} />
        <input type="file" className="border p-2 w-full mb-2" onChange={handleImageUpload} />
        <select className="border p-2 w-full mb-2" onChange={(e) => setPlacement({ ...placement, category: e.target.value })}>
          <option value="technical">Technical</option>
          <option value="non-technical">Non-Technical</option>
          <option value="internship">Internship</option>
        </select>
        <button onClick={addPlacement} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add Placement</button>
      </div>

      {/* Display Placements */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">Uploaded Students</h2>

        {placements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placements.map((placement) => (
              <div key={placement._id} className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center">
                <img src={`http://localhost:5000/uploads/${placement.studentImage}`} 
                     alt="Student" className="w-16 h-16 rounded-full mr-4" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{placement.studentName}</h3>
                  <p className="text-gray-600">{placement.title} at {placement.companyName}</p>
                  <p className="text-gray-500">Package: ₹{placement.package} LPA</p>
                </div>
                <button onClick={() => deletePlacement(placement._id)} 
                        className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default UpdatePlacement;
