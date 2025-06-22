import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page home-page">
      <div className="header-left">
  <img src="/spurhackslogo.png" alt="SpurHacks Logo" className="logo-image" />
  <div className="company-name">Promptly</div>
</div>
      <h1>Artificial Interviews. Real Feedback.</h1>
      <p>Practice Real-Time Interviews With AI At Your Side.</p>
      <div className="button-group">
        <button onClick={() => navigate("/job")}>Try A Promptly Demo</button>
        <button onClick={() => navigate("/pricing")}>Our Pricing Models</button>
      </div>
      <small>free single-question demo trial available - no sign up required.</small>
      <div className="footer-copyright">
        © 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and Abhinav Dave. All rights reserved.
      </div>
    </div>
  );
}

export default HomePage;