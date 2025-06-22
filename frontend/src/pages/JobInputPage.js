import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import BackButton from "../components/BackButton";

function JobInputPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  // In JobInputPage.js, update the handleContinue function:
const handleContinue = () => {
  if (jobTitle.trim() === "") {
    setShowError(true);
  } else {
    navigate("/description", { state: { jobTitle: jobTitle.trim() } });
  }
};

  const handleInputChange = (e) => {
    setJobTitle(e.target.value);
    if (showError && e.target.value.trim() !== "") {
      setShowError(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="page job-page">
      <HomeButton />
      <BackButton />
      <h1>Let's Get Started With A Job.</h1>
      <p>Please Input A Desired Job Title To Begin:</p>
      <input
        type="text"
        placeholder="example: software engineer"
        value={jobTitle}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <small className={`helper-text ${showError ? 'error' : ''}`}>
        {showError 
          ? "Please add a job title so that you may proceed."
          : "This lets the AI start preparing your mock interview question for you."
        }
      </small>
      <button className="continue-button" onClick={handleContinue}>Continue</button>
    
    <div className="footer-copyright">
© 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and Abhinav Dave. All rights reserved.</div>
    
    </div>
  );
}

export default JobInputPage;