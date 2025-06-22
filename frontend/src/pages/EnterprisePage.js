import React from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import BackButton from "../components/BackButton";

function EnterprisePage() {
  const navigate = useNavigate();

  return (
    <div className="page enterprise-page">
      <HomeButton />
      <BackButton />
      
      <div className="enterprise-hero">
        <h1>Promptly Enterprise</h1>
        <p className="enterprise-subtitle">An Interview Practice App Turned Evaluator. Assess your candidates autonomously with reliability on Promptly.</p>
      </div>

      <div className="enterprise-content">
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🚀</div>
            <h3>Scale Hiring Operations</h3>
            <p>Conduct as many pre-screening interviews simultaneously- our AI will grade and send full statistic reports to you. Reduces Time-To-Hire, eliminates scheduling bottlenecks.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Eliminate Bias & Ensure Consistency</h3>
            <p>Impartial Gemini evaluation ensures fairness for each candidate, promoting inclusive and quality assessment practices.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Reduce Hiring Costs</h3>
            <p>Automate initial screening rounds, freeing up senior staff for strategic decision-making, cutting recruitment expenses.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
            <h3>Data-Driven Talent Insights</h3>
            <p>Advanced analytics reveal hiring patterns, predict candidate success, and optimize your recruitment strategy with actionable intelligence.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🏢</div>
            <h3>White-Label Integration</h3>
            <p>Seamlessly integrate with your existing HR systems and brand the platform as your own for a cohesive candidate experience.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🔒</div>
            <h3>Enterprise Security & Compliance</h3>
            <p>SOC 2 certified, GDPR compliant, with end-to-end encryption ensuring your sensitive hiring data remains protected.</p>
          </div>
        </div>

        <div className="roi-section">
          <h2>Undeniable ROI for Industry Leaders</h2>
          <div className="roi-stats">
            <div className="roi-stat">
              <div className="roi-number">50%</div>
              <div className="roi-label">Faster Time-to-Hire</div>
            </div>
            <div className="roi-stat">
              <div className="roi-number">$$$</div>
              <div className="roi-label">Cost Reduction</div>
            </div>
            <div className="roi-stat">
              <div className="roi-number">100%</div>
              <div className="roi-label">Interview Capacity</div>
            </div>
           
          </div>
        </div>

        <div className="enterprise-features">
          <h2>Enterprise-Grade Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Unlimited concurrent interviews with auto-scaling infrastructure</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Constant training of AI models based on the company's success & feedback. Win-Win.</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Upcoming multi-language support for global hiring initiatives</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Advanced reporting dashboards for managers with predictive analytics and data trends</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>24/7 dedicated customer success team</span>
            </div>
          </div>
        </div>
      </div>

      <button className="continue-button" onClick={() => navigate("/")}>
        Contact Us.
      </button>

      <div className="footer-copyright">
        © 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and Abhinav Dave. All rights reserved.
      </div>
    </div>
  );
}

export default EnterprisePage;