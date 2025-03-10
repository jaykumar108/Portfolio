require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "Public")));

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connection Successful (Atlas)"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// DATABASE SCHEMA
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  message: String,
  date: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleString("en-GB", {
        hour12: false,
        timeZone: "Asia/Kolkata",
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).replace(",", "");
    },
  },
});

const Contact = mongoose.model("Contact", contactSchema);

// Serve HTML Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});
app.get("/jhufdyrbbfh874hhyehfg", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});
app.get("/thank.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "thank.html"));
});

// FORM SUBMISSION ROUTE
app.post("/submit-form", async (req, res) => {
  const { name, email, mobile, message } = req.body;
  const newContact = new Contact({ name, email, mobile, message });

  try {
    await newContact.save();
    console.log(newContact);
    res.redirect("/thank.html");
  } catch (error) {
    console.error("❌ Error saving data: ", error);
    res.status(500).send("Error saving data.");
  }
});

// FETCH DATA FOR ADMIN PANEL
app.get("/get-submissions", async (req, res) => {
  try {
    const submissions = await Contact.find({}).sort({ date: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).send("Error fetching data.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
