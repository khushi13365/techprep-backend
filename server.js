const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Failed:", err));

// 1. Database Schema (Yeh define karega ki data kaisa dikhega)
const quizSchema = new mongoose.Schema({
  userName: String,
  email: String,
  score: Number,
  totalQuestions: Number,
  submittedCode: String, // Split-screen IDE se aane wala code
  date: { type: Date, default: Date.now }
}, { strict: false }); // strict: false allows extra fields just in case

const QuizResult = mongoose.model('QuizResult', quizSchema);

// 2. API Route (Frontend yahan data bhejega)
app.post('/api/save-result', async (req, res) => {
  try {
    const newResult = new QuizResult(req.body);
    await newResult.save();
    console.log("New quiz data saved:", req.body);
    res.status(201).json({ message: "Data successfully saved to MongoDB Atlas!" });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send("TechPrepAI Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});