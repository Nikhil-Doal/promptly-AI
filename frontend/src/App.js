import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import JobInputPage from "./pages/JobInputPage";
import DescriptionPage from "./pages/DescriptionPage";
import InterviewPage from "./pages/InterviewPage";
import ResultsPage from "./pages/ResultsPage";
import PricingPage from "./pages/PricingPage";
import EnterprisePage from "./pages/EnterprisePage";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Background video component */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/background-video.mp4" type="video/mp4" />
          {/* Add other video formats if needed */}
          <source src="/background-video.webm" type="video/webm" />
        </video>
      </div>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job" element={<JobInputPage />} />
        <Route path="/description" element={<DescriptionPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
      </Routes>
    </Router>
  );
}

export default App;