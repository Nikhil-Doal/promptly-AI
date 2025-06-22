import React from "react";
import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();
  return (
    <div className="logo-home-button" onClick={() => navigate("/")}>
      <img 
        src="/spurhackslogo.png" 
        alt="SpurHacks Logo" 
        className="logo-image"
      />
    </div>
  );
}

export default HomeButton;