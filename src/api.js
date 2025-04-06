import axios from "axios";
import API_BASE_URL from "./config";

// Fetch all quizzes
export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
};

// Upload a PDF file for quiz generation
export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return null;
  }
};

// Generate quiz from raw text
export const generateQuiz = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-quiz`, { text });
    return response.data;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};
