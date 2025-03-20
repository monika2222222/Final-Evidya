import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // ✅ Fetch Announcements from Database
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("http://localhost:5000/announcements");
      const data = await response.json();
      setAnnouncements(data);
      console.log("Announcements Data:", announcements);

    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ✅ Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview
  };

  // ✅ Handle Announcement Submission (POST)
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Please fill out both fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5000/addAnnouncement", {
        method: "POST",
        body: formData, // ✅ Send as FormData
      });

      if (!response.ok) {
        throw new Error("Failed to post announcement");
      }

      setTitle("");
      setMessage("");
      setImage(null);
      setPreview("");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  // ✅ Delete Announcement (DELETE)
  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch(`http://localhost:5000/deleteAnnouncement/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* ✅ Header */}
        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Create Announcements</h1>
          <Link to={"/Staff"} className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition">
            &#8592; Go Back
          </Link>
        </header>

        <main className="p-6">
          {/* ✅ Announcement Form */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Post a New Announcement</h2>
            <form onSubmit={handleAnnouncementSubmit} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter announcement details"
                  rows="4"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Upload Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
                {preview && <img src={preview} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded" />}
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Post Announcement
              </button>
            </form>
          </section>

          {/* ✅ Display Announcements */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Posted Announcements</h2>
            {announcements.length > 0 ? (
              <ul className="space-y-4">
                {announcements.map((announcement) => (
                  <li key={announcement._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2">
                    <p className="text-xl font-semibold text-blue-600">{announcement.title}</p>
                    <p className="text-gray-700">{announcement.message}</p>
                    {announcement.image && (
                      <img
                        src={`http://localhost:5000/uploads/${announcement.image.split("/").pop()}`}
                        alt="Announcement"
                        className="w-40 h-40 object-cover rounded"
                        onError={(e) => e.target.src = "https://via.placeholder.com/150"} // Fallback image
                      />
                    )}
                    <button onClick={() => deleteAnnouncement(announcement._id)} className="text-red-500 hover:text-red-700 font-medium self-end mt-2">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No announcements posted yet.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
