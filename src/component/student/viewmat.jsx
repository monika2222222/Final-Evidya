import React, { useState } from "react";
import { Link } from "react-router-dom";

const viewmat = () => {
  const [materials, setMaterials] = useState([]);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch study materials when user clicks "Fetch Materials"
  const fetchMaterials = async () => {
    if (!department || !year) {
      setError("Please select both Department and Year.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`http://localhost:5000/materials?department=${department}&year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch study materials.");
      }
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">View Study Materials</h1>
          <Link to={"/Student"} className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
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

            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={fetchMaterials}>
              🔍 Fetch Materials
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Loading Indicator */}
          {loading && <p className="text-gray-500">Fetching study materials...</p>}

          {/* Display Study Materials */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Study Materials</h2>
            {materials.length > 0 ? (
              <ul className="space-y-4">
                {materials.map((material, index) => (
                  <li key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="font-medium text-blue-600">{material.title}</p>

                    {material.type === "link" ? (
                      <a href={material.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1 block">
                        {material.content}
                      </a>
                    ) : (
                      <a href={`http://localhost:5000${material.content}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1 block">
                        📥 Download File
                      </a>
                    )}

                    <p className="text-gray-500 text-sm mt-2">
                      Uploaded on: {new Date(material.uploadDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && <p className="text-gray-500">No study materials found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default viewmat;
