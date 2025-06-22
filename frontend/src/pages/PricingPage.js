import React from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";

function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="page pricing-page">
      <HomeButton />
      <h1>Pricing Models</h1>
      
      <div className="pricing-cards">
        <div className="pricing-card">
          <h3>Free Trial</h3>
          <div className="price">$0</div>
          <div className="price-period">forever</div>
          <ul className="features">
            <li>1 interview question</li>
            <li>Basic AI feedback</li>
            <li>No sign up required</li>
            <li>Camera recording</li>
          </ul>
          <button onClick={() => navigate("/job")}>Try Now</button>
        </div>

        <div className="pricing-card featured">
          <div className="featured-badge">Most Popular</div>
          <h3>Pro</h3>
          <div className="price">$9.99</div>
          <div className="price-period">FOREVER</div>
          <ul className="features">
            <li>Unlimited practice</li>
            <li>Advanced AI feedback</li>
            <li>Custom job descriptions</li>
            <li>Performance analytics</li>
            <li>Interview history</li>
            <li>Priority support</li>
          </ul>
          <button>Get Started</button>
        </div>

        <div className="pricing-card">
          <h3>Enterprise</h3>
          <div className="price">$99</div>
          <div className="price-period">per month</div>
          <ul className="features">
            <li>Everything in Pro</li>
            <li>Team management</li>
            <li>Custom branding</li>
            <li>API access</li>
            <li>Dedicated support</li>
            <li>Custom integrations</li>
          </ul>
          <button onClick={() => navigate("/enterprise")}>Learn More</button>
        </div>
      </div>

        <div className="footer-copyright">
  © 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and Abhinav Dave. All rights reserved.
</div>

    </div>
  );
}

export default PricingPage;