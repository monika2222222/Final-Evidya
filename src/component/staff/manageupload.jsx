import React, { useState } from "react";
import { Link } from "react-router-dom";

const ManageUploads = () => {
  const [materials, setMaterials] = useState([]);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  // ✅ Fetch uploaded study materials
  const fetchMaterials = async () => {
    if (!department || !year) {
      alert("Please select both Department and Year!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/materials?department=${department}&year=${year}`);
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // ✅ Delete Study Material
  const deleteMaterial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      const response = await fetch(`http://localhost:5000/deleteMaterial/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      alert("Study material deleted successfully!");
      fetchMaterials(); // Refresh list after deletion
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ✅ Header */}
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Manage Study Materials</h1>
          <Link to="/Staff" className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100">
            &#8592; Go Back
          </Link>
        </header>

        <main className="p-6">
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

            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={fetchMaterials}>
              🔍 Fetch Materials
            </button>
          </div>

          {/* ✅ Display Uploaded Study Materials */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Uploaded Study Materials</h2>
            {materials.length > 0 ? (
              <ul className="space-y-4">
                {materials.map((material) => (
                  <li key={material._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="font-medium text-blue-600">{material.title}</p>
                    <p className="text-gray-600">{material.description}</p>

                    {material.type === "link" ? (
                      <a href={material.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1 block">
                        🔗 Open Link
                      </a>
                    ) : (
                      <a href={`http://localhost:5000${material.content}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1 block">
                        📥 Download File
                      </a>
                    )}

                    <p className="text-gray-500 text-sm mt-2">Uploaded on: {new Date(material.uploadDate).toLocaleDateString()}</p>

                    <button onClick={() => deleteMaterial(material._id)} className="text-red-500 hover:text-red-700 font-medium mt-2">
                      🗑️ Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No study materials found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ManageUploads;
