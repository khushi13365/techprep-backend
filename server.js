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

// Database Schema
const quizSchema = new mongoose.Schema({
  userName: String,
  email: String,
  score: Number,
  totalQuestions: Number,
  submittedCode: String, 
  date: { type: Date, default: Date.now }
}, { strict: false }); 

const QuizResult = mongoose.model('QuizResult', quizSchema);

// ROUTE 1: Original Save Route
app.post('/api/save-result', async (req, res) => {
  try {
    const newResult = new QuizResult(req.body);
    await newResult.save();
    res.status(201).json({ message: "Data successfully saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// ROUTE 2: Missing Route (Save Challenge)
app.post('/api/quizzes/results', async (req, res) => {
  try {
    const newResult = new QuizResult(req.body);
    await newResult.save();
    res.status(201).json({ message: "Challenge Result Saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save challenge data" });
  }
});

// ROUTE 3: Missing Route (Fetch User Data)
app.get('/api/quizzes/results/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const results = await QuizResult.find({ 
      $or: [{ email: userEmail }, { studentEmail: userEmail }] 
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// ROUTE 4: Missing Route (DSA Code Runner Mock)
app.post('/api/dsa/run', (req, res) => {
  res.status(200).json({ 
      success: true, 
      output: "Code execution simulated successfully.",
      passed: true
  });
});

// Test Route
app.get('/', (req, res) => {
  res.send("TechPrepAI Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
