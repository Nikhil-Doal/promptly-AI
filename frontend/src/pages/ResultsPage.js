import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import HomeButton from "../components/HomeButton";

function ResultsPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const location = useLocation();

  // Get job title from navigation state (passed from interview page)
  const jobTitle = location.state?.jobTitle || "Not specified";

  // Mock data - in a real app, this would come from your interview analysis
  const results = {
    grade: "F",
    wordsPerMinute: 132,
    confidenceRanking: "Low",
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would normally send the email to your backend
      console.log("Sending detailed report to:", email);
      setEmailSent(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setEmailSent(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="page results-page">
      <HomeButton />

      <h1>Promptly Grade: {results.grade}</h1>

      <div className="results-content">
        <div className="result-item">
          <h3>Words Per Minute</h3>
          <div className="result-value">{results.wordsPerMinute}</div>
        </div>

        <div className="result-item">
          <h3>Confidence Ranking</h3>
          <div className="result-value">{results.confidenceRanking}</div>
        </div>

        <form onSubmit={handleEmailSubmit} className="email-form">
          <input
            type="email"
            placeholder="Enter your email for detailed report"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button type="submit" disabled={emailSent}>
            {emailSent ? "Report Sent!" : "Get Detailed Report"}
          </button>
          <p className="pro-text">
            Detailed reports available for Pro users only
          </p>
        </form>
      </div>

      <div className="job-info">You Interviewed For: {jobTitle}</div>

      <div className="footer-copyright">
        © 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and
        Abhinav Dave. All rights reserved.
      </div>
    </div>
  );
}

export default ResultsPage;
