import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import BackButton from "../components/BackButton";

function DescriptionPage() {
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the job title from navigation state or fallback
  const jobTitle = location.state?.jobTitle || "Not specified";

  const handleContinue = () => {
    navigate("/interview", { 
      state: { 
        jobTitle: jobTitle, 
        description: desc 
      } 
    });
  };

  // Handle Enter key press (Ctrl+Enter or Cmd+Enter for textarea)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent default textarea behavior
      handleContinue();
    }
  };

  return (
    <div className="page description-page">
      <HomeButton />
      <BackButton />
      <h1>Now, Onto The Description!</h1>
      <p>Please Input A Job Description (if available).</p>
      <textarea
        placeholder="optional."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <small className="helper-text">
        If available, the job description helps the AI tailor the question<br />
        and provide accurate feedback in the report afterwards.<br />
        <em>Press Ctrl+Enter (or Cmd+Enter on Mac) to continue.</em>
      </small>
      <div className="job-selection">
        You Have Selected: {jobTitle}
      </div>
      <button className="continue-button" onClick={handleContinue}>Continue</button>
    <div className="footer-copyright">
© 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and Abhinav Dave. All rights reserved.</div>
    
    </div>
  );
}

export default DescriptionPage;