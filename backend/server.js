require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Quiz = require("./models/Quiz"); // ✅ Import Quiz Model

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Function to Generate Questions using Google Gemini AI
async function generateQuestionsGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Generate 5 multiple-choice questions with 4 options and one correct answer based on this text: ${text}`
    );

    const response = await result.response;
    const generatedText = response.candidates[0].content.parts[0].text;

    return JSON.parse(generatedText); // ✅ Ensure AI returns a JSON array of questions
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return null;
  }
}

// ✅ Upload PDF, Extract Text, and Generate Quiz
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    fs.unlinkSync(pdfPath); // ✅ Delete file after processing

    const extractedText = pdfData.text;
    const questions = await generateQuestionsGemini(extractedText);

    if (!questions) return res.status(500).json({ error: "Failed to generate quiz" });

    const newQuiz = new Quiz({ title: req.file.originalname, questions });
    await newQuiz.save();

    res.json({ message: "✅ Quiz generated successfully", quiz: newQuiz });
  } catch (error) {
    console.error("❌ Error processing file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Fetch All Quizzes
app.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// ✅ Generate Quiz from Raw Text
app.post("/generate-quiz", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const questions = await generateQuestionsGemini(text);
    if (!questions) return res.status(500).json({ error: "Quiz generation failed" });

    res.json({ quiz: { title: "Generated Quiz", questions } });
  } catch (error) {
    console.error("❌ Error generating quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));
