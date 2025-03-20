const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ MongoDB Connection
mongoose
mongoose.connect("mongodb+srv://Developer1:dbdeveloper1@e-vidya-cluster.n606r.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  enrollmentNo: String,
  department: String,
  year: String,
  division: String,
  fees: { type: Boolean, default: false },  // ✅ Default false
  approved: { type: Boolean, default: false },
  requestSent: { type: Boolean, default: false },
  attendance: Number,
  oralMarks: Number,
  unitTest1: [{ subject: String, marks: Number }],
  unitTest2: [{ subject: String, marks: Number }],
  passkey: String
});

// ✅ Student Model
const Student = mongoose.model("Student", studentSchema);
const Report = mongoose.model("Report", studentSchema);

// ✅ Route to Add Student
app.post("/addStudent", async (req, res) => {
  try {
    const { name, enrollmentNo, department, year, division, fees = false } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ enrollmentNo });
    if (existingStudent) {
      return res.status(400).json({ error: "Student with this Enrollment No already exists" });
    }

    const newStudent = new Student({ name, enrollmentNo, department, year, division, fees });
    await newStudent.save();

    res.status(201).json({ message: "Student added successfully", newStudent });
  } catch (error) {
    res.status(500).json({ error: "Error adding student" });
  }
});

// ✅ Get Students (Filtered by Department, Year, Division)
app.get("/students", async (req, res) => {
  try {
    const { department, year, division, searchBy, searchValue } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (year) filter.year = year;
    if (division) filter.division = division;
    if (searchBy && searchValue) filter[searchBy] = new RegExp(searchValue, "i"); // Case-insensitive search

    const students = await Student.find(filter);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

// ✅ Edit Student
app.put("/editStudent/:id", async (req, res) => {
  try {
    const { name, enrollmentNo, department, year, division } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, enrollmentNo, department, year, division },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
});

// ✅ Delete Student
app.delete("/deleteStudent/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

// ✅ Update Fee Status
app.put("/updateFeeStatus/:id", async (req, res) => {
  try {
    const { fees } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { fees },  
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Fee status updated", updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error updating fee status", error });
  }
});

// ✅ Save Report
app.post("/saveReport", async (req, res) => {
  const report = new Report(req.body);
  await report.save();
  res.json({ message: "Report saved successfully!" });
});

// ✅ Fetch Report by Enrollment No & Passkey
app.get("/getReport", async (req, res) => {
  const { enrollmentNo, passkey } = req.query;
  const report = await Report.findOne({ enrollmentNo, passkey });

  if (!report) return res.status(404).json({ message: "Invalid credentials" });
  res.json(report);
});


// ✅ Student Login API
app.post("/studentLogin", async (req, res) => {
  const { enrollmentNo } = req.body;
  const student = await Student.findOne({ enrollmentNo });

  if (!student) {
    return res.json({ message: "Student not found!" });
  }

  if (!student.approved) {
    return res.json({ message: "Not Approved", requestSent: student.requestSent });
  }

  return res.json({ message: "Login successful!", approved: true });
});

// ✅ Send Request to Staff API
app.post("/sendRequest", async (req, res) => {
  const { enrollmentNo } = req.body;
  const student = await Student.findOne({ enrollmentNo });

  if (student) {
    student.requestSent = true;
    await student.save();
    return res.json({ message: "Request sent to Staff!" });
  }

  res.status(404).json({ message: "Student not found!" });
});

// ✅ Fetch Pending Requests
app.get("/pendingRequests", async (req, res) => {
  const requests = await Student.find({ requestSent: true, approved: false });
  res.json(requests);
});

// ✅ Approve Student Request
app.post("/approveStudent", async (req, res) => {
  const { enrollmentNo } = req.body;
  
  const student = await Student.findOneAndUpdate(
    { enrollmentNo },
    { approved: true, requestSent: false },  
    { new: true }
  );

  if (student) {
    return res.json({ message: "Student Approved!", student });
  }

  res.status(404).json({ message: "Student not found!" });
});

// ✅ Remove Student Access
app.put("/removeAccess/:enrollmentNo", async (req, res) => {
  await Student.updateOne({ enrollmentNo: req.params.enrollmentNo }, { approved: false });
  res.json({ message: "Access removed" });
});
// ✅ Define Staff Schema & Model
const staffSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  email: String,
  subject: String,
  username: String,
  password: String,
  approved: { type: Boolean, default: true } // Staff is approved by default
});

const Staff = mongoose.model("Staff", staffSchema);

// ✅ Add Staff API (Admin Can Add Staff)
app.post("/addStaff", async (req, res) => {
  try {
      const { name, mobile, address, email, subject, username, password } = req.body;

      // Check if staff username already exists
      const existingStaff = await Staff.findOne({ username });
      if (existingStaff) {
          return res.status(400).json({ error: "Username already exists" });
      }

      const newStaff = new Staff({ name, mobile, address, email, subject, username, password });
      await newStaff.save();

      res.status(201).json({ message: "Staff added successfully", newStaff });
  } catch (error) {
      res.status(500).json({ error: "Error adding staff" });
  }
});

// ✅ Get All Staff API (For Admin to View Staff List)
app.get("/getStaffs", async (req, res) => {
  try {
      const staffs = await Staff.find();
      res.json(staffs);
  } catch (error) {
      res.status(500).json({ error: "Error fetching staff members" });
  }
});

// ✅ Delete Staff API (Admin Can Delete Staff)
app.delete("/deleteStaff/:id", async (req, res) => {
  try {
      const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
      if (!deletedStaff) {
          return res.status(404).json({ error: "Staff not found" });
      }
      res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting staff" });
  }
});

// ✅ Staff Login API (Only Approved Staff Can Log In)
app.post("/staffLogin", async (req, res) => {
  const { username, password } = req.body;

  try {
      const staff = await Staff.findOne({ username, password, approved: true });

      if (staff) {
          return res.json({ success: true, message: "Login Successful" });
      } else {
          return res.json({ success: false, message: "Invalid Username, Password, or Not Approved" });
      }
  } catch (error) {
      console.error("Staff Login Error:", error);
      res.status(500).json({ success: false, message: "Server Error! Try again later." });
  }
});

// ✅ Placement Schema & Model
const placementSchema = new mongoose.Schema({
  studentName: String,
  companyName: String,
  title: String,
  package: Number,
  category: String,
  studentImage: String,
  postedDate: { type: Date, default: Date.now },
});

const statsSchema = new mongoose.Schema({
  totalPlacements: { type: Number, default: 0 },
  averagePackage: { type: Number, default: 0 },
  highestPackage: { type: Number, default: 0 },
});

const Placement = mongoose.model("Placement", placementSchema);
const Stats = mongoose.model("Stats", statsSchema);

// ✅ Multer Storage Configuration (For Image Uploads)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Fetch Placements (With Category Filter)
app.get("/api/placement/jobs", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "all" ? { category } : {};
    const jobs = await Placement.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching placements" });
  }
});

// ✅ Add Placement & Update Stats (With Image Upload)
app.post("/api/placement/jobs", upload.single("studentImage"), async (req, res) => {
  try {
    const { studentName, companyName, title, package, category } = req.body;
    const studentImage = req.file ? req.file.filename : "";

    if (!studentName || !companyName || !title || !package || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPlacement = new Placement({ studentName, companyName, title, package, category, studentImage });
    await newPlacement.save();

    await updatePlacementStats();
    res.json({ message: "Placement added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Delete Placement & Update Stats
app.delete("/api/placement/jobs/:id", async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ error: "Placement not found" });
    }

    // Delete associated image file
    if (placement.studentImage) {
      fs.unlink(`uploads/${placement.studentImage}`, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    await Placement.findByIdAndDelete(req.params.id);
    await updatePlacementStats();

    res.json({ message: "Placement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting placement" });
  }
});

// ✅ Fetch Placement Stats
app.get("/api/placement/stats", async (req, res) => {
  try {
    const stats = await Stats.findOne() || { totalPlacements: 0, highestPackage: 0, averagePackage: 0 };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

// ✅ Update Placement Stats (Helper Function)
async function updatePlacementStats() {
  try {
    const allPlacements = await Placement.find();
    const totalPlacements = allPlacements.length;
    const highestPackage = allPlacements.length > 0 ? Math.max(...allPlacements.map((p) => p.package)) : 0;
    const averagePackage = allPlacements.length > 0
      ? (allPlacements.reduce((acc, p) => acc + p.package, 0) / totalPlacements).toFixed(2)
      : 0;

    await Stats.findOneAndUpdate({}, { totalPlacements, highestPackage, averagePackage }, { upsert: true, new: true });
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}
 
app.get("/getStudent", async (req, res) => {
  const { enrollmentNo } = req.query;

  try {
      // ✅ Ensure enrollment number is treated as a string
      const student = await Student.findOne({ enrollmentNo: enrollmentNo });

      if (!student) {
          return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
  } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});




// ✅ Save Student Report
app.post("/saveReport", async (req, res) => {
  try {
      const { enrollmentNo, unitTest1, unitTest2, attendance, oralMarks, submission } = req.body;

      const student = await Student.findOneAndUpdate(
          { enrollmentNo },
          { unitTest1, unitTest2, attendance, oralMarks, submission },
          { new: true, upsert: true }
      );

      res.status(201).json({ message: "Report saved successfully!", student });
  } catch (error) {
      res.status(500).json({ error: "Error saving report" });
  }
});

// ✅ API: Fetch Student Reports with Filters
app.get("/reports", async (req, res) => {
  const { department, year } = req.query;

  try {
      // ✅ Ensure fetching from `Report` collection, not `Student`
      const reports = await Report.find(
          { department, year },
          "name enrollmentNo department year division attendance oralMarks unitTest1 unitTest2 passkey"
      );

      if (reports.length === 0) {
          return res.status(404).json({ error: "No reports found for the selected criteria" });
      }

      res.json(reports);
  } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ API: Edit Student Report (Update UT1 & UT2 Marks)
app.put("/editReport/:id", async (req, res) => {
  const { id } = req.params;
  const { unitTest1, unitTest2 } = req.body;

  try {
      const updatedReport = await Student.findByIdAndUpdate(
          id,
          { unitTest1, unitTest2 },
          { new: true }
      );

      if (!updatedReport) {
          return res.status(404).json({ error: "Report not found" });
      }

      res.json({ message: "Report updated successfully", updatedReport });
  } catch (error) {
      console.error("Error editing report:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ API: Delete Student Report
app.delete("/deleteReport/:id", async (req, res) => {
  const { id } = req.params;

  try {
      const deletedReport = await Student.findByIdAndDelete(id);

      if (!deletedReport) {
          return res.status(404).json({ error: "Report not found" });
      }

      res.json({ message: "Report deleted successfully" });
  } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ API: Fetch Student Report by Enrollment
app.get("/api/student/report/:enrollment", async (req, res) => {
  const { enrollment } = req.params;

  try {
      // ✅ Match field name correctly
      const student = await Student.findOne({ enrollmentNo: enrollment });

      if (!student) {
          return res.status(404).json({ error: "Student not found" });
      }

      res.json(student);
  } catch (error) {
      console.error("Error fetching student report:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



// ✅ Announcement Schema
const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  image: String,
  date: { type: Date, default: Date.now }
});

const Announcement = mongoose.model("Announcement", announcementSchema);

// ✅ Multer Storage for Announcements
const announcementStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const announcementUpload = multer({ storage: announcementStorage });

// ✅ Post Announcement (with Image)
app.post("/addAnnouncement", announcementUpload.single("image"), async (req, res) => {
  const { title, message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

  await new Announcement({ title, message, image: imageUrl }).save();
  res.status(201).json({ message: "Announcement posted!" });
});

// ✅ Get Announcements
app.get("/announcements", async (req, res) => {
  res.json(await Announcement.find());
});

// ✅ Delete Announcement
app.delete("/deleteAnnouncement/:id", async (req, res) => {
  try {
    const result = await Announcement.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Announcement not found" });
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting announcement" });
  }
});



// ✅ Study Material Schema
const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  year: String,
  type: String, // "link" or "file"
  content: String, // Stores either file URL or link
  uploadedAt: { type: Date, default: Date.now },
});

const Material = mongoose.model("Material", materialSchema);

// ✅ Multer Storage for File Uploads
const materialStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp
  },
});

const materialUpload = multer({ storage: materialStorage });

// ✅ Upload Study Material
app.post("/uploadMaterial", materialUpload.single("file"), async (req, res) => {
  const { title, description, department, year, type, content } = req.body;
  
  let materialContent = content;
  if (type === "file" && req.file) {
    materialContent = `http://localhost:5000/uploads/${req.file.filename}`; // Save file URL
  }

  try {
    const newMaterial = new Material({
      title,
      description,
      department,
      year,
      type,
      content: materialContent,
    });
    
    await newMaterial.save();
    res.status(201).json({ message: "Material uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error uploading material" });
  }
});

// ✅ Get All Study Materials
app.get("/materials", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Error fetching materials" });
  }
});

// ✅ Delete Study Material
app.delete("/deleteMaterial/:id", async (req, res) => {
  try {
    const result = await Material.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Material not found" });
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting material" });
  }
});


// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
