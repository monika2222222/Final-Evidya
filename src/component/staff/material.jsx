import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const material = () => {
  const navigate = useNavigate(); // ✅ For redirection
  const [title, setTitle] = useState("");
  const [type, setType] = useState("link");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  // ✅ Handle Upload (POST API)
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("department", department);
    formData.append("year", year);
    formData.append("type", type);
    formData.append("description", description);

    if (type === "file") {
      formData.append("file", file);
    } else {
      formData.append("content", link);
    }

    try {
      const response = await fetch("http://localhost:5000/uploadMaterial", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload study material");
      }

      alert("Study material uploaded successfully!");
      setTitle("");
      setDescription("");
      setLink("");
      setFile(null);
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ✅ Header */}
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Upload Study Material</h1>
          <Link to="/Staff" className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100">
            &#8592; Go Back
          </Link>
        </header>

        <main className="p-6">
          {/* ✅ Upload Form */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Study Material</h2>
            <form onSubmit={handleUpload} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              {/* ✅ Select Department */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Department</option>
                  <option value="co">Computer</option>
                  <option value="entc">ENTC</option>
                  <option value="mech">Mechanical</option>
                  <option value="civil">Civil</option>
                  <option value="it">IT</option>
                </select>
              </div>

              {/* ✅ Select Year */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Year</option>
                  <option value="first">First</option>
                  <option value="second">Second</option>
                  <option value="third">Third</option>
                </select>
              </div>

              {/* ✅ Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter title" />
              </div>

              {/* ✅ Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter description" rows="3"></textarea>
              </div>

              {/* ✅ Upload Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Upload Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="link">Post a Link</option>
                  <option value="file">Upload a File</option>
                </select>
              </div>

              {/* ✅ File or Link Input */}
              {type === "file" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Choose File</label>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Link</label>
                  <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter the link" />
                </div>
              )}

              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Upload</button>
            </form>
          </section>

          {/* ✅ "Manage Uploads" Button (Redirects to Management Page) */}
          <section className="text-center mt-6">
            <button onClick={() => navigate("/Manageupload")} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
              📂 Manage Uploads
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default material;
