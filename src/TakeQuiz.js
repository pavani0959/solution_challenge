import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const API_BASE_URL = "http://127.0.0.1:5001"; // Update this if needed

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quizzes`);
        setQuizzes(response.data);
      } catch (error) {
        console.error("❌ Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  return (
    <div>
      <h1>Take a Quiz</h1>
      {!selectedQuiz ? (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz._id} onClick={() => handleSelectQuiz(quiz)}>
              {quiz.title}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2>{selectedQuiz.title}</h2>
          {selectedQuiz.questions.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(index, option)}
                  style={{
                    backgroundColor: answers[index] === option ? "lightblue" : "",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
