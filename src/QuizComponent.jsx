import React, { useState } from "react";

const QuizComponent = () => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Fetch quiz from backend
  const fetchQuiz = async () => {
    const response = await fetch("http://127.0.0.1:5001/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Newton's Laws of Motion" }),
    });
    const data = await response.json();
    setQuiz(data.quiz);
    setAnswers(new Array(data.quiz.length).fill(null));
    setScore(null);
    setIsQuizActive(true);
    setTimeLeft(30);
  };

  // Submit quiz
  const submitQuiz = async () => {
    const response = await fetch("http://127.0.0.1:5001/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        correct_answers: quiz.map((q) => q.answer),
      }),
    });
    const data = await response.json();
    setScore(data.score);
    setIsQuizActive(false);
  };

  // Handle option selection
  const handleOptionClick = (index, option) => {
    const newAnswers = [...answers];
    newAnswers[index] = option;
    setAnswers(newAnswers);
  };

  // Countdown Timer
  React.useEffect(() => {
    if (isQuizActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsQuizActive(false);
      submitQuiz();
    }
  }, [isQuizActive, timeLeft]);

  return (
    <div className="container p-4">
      <button onClick={fetchQuiz} className="btn btn-primary">Take Quiz</button>
      {isQuizActive && <h4 className="text-danger">Time Left: {timeLeft}s</h4>}
      
      {quiz.map((q, index) => (
        <div key={index} className="card mt-3 p-3">
          <p>{q.question}</p>
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(index, option)}
              className={`btn m-1 ${answers[index] === option ? "btn-success" : "btn-outline-primary"}`}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
      
      {isQuizActive && <button onClick={submitQuiz} className="btn btn-success mt-3">Submit Quiz</button>}
      {score !== null && <h3>Your Score: {score}</h3>}
    </div>
  );
};

export default QuizComponent;
