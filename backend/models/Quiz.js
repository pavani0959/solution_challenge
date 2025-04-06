const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String], // Array of 4 options
  correctAnswer: String, // Correct answer text
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Quiz title (e.g., "Physics Quiz")
  questions: [QuestionSchema], // Array of questions
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

// ✅ Prevent redeclaration error
module.exports = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
