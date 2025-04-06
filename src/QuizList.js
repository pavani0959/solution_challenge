import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const API_BASE_URL = "http://127.0.0.1:5001"; // Update this if needed

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch quizzes from backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quizzes`); // Fetch quizzes
        setQuizzes(response.data); // Store quizzes in state
      } catch (error) {
        console.error("❌ Error fetching quizzes:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h1>Available Quizzes</h1>
      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id}>{quiz.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizList;
