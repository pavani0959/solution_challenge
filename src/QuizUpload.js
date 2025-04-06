import React, { useState } from "react";
import axios from "axios"; // Import axios

const API_BASE_URL = "http://127.0.0.1:5001"; // Update this if needed

const QuizUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setMessage("✅ Quiz generated successfully!");
      }
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      setMessage("❌ Error uploading file.");
    }
  };

  return (
    <div>
      <h2>Upload PDF to Generate Quiz</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default QuizUpload;
