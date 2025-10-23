import React from 'react';

function AboutPage({ goBack }) {
  return (
    <div className="about-page">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <span className="back-icon">←</span>
          Back to Dashboard
        </button>
        <h1>About Munici-PAL</h1>
        <p>Connecting Communities, Empowering Citizens</p>
      </div>

      <div className="about-hero">
        <div className="hero-content">
          <h2>Our Purpose</h2>
          <p>
            Munici-PAL is a revolutionary civic engagement platform designed to bridge the gap 
            between citizens and municipal services. We believe in creating smarter, more responsive 
            communities through technology that empowers every resident to actively participate 
            in improving their neighborhood.
          </p>
        </div>
      </div>

      <div className="community-image-section">
        <div className="container">
          <div className="community-content">
            <div className="community-text">
              <h2>Building Happier Communities Together</h2>
              <p>
                At Munici-PAL, we believe that strong communities are built on collaboration, 
                communication, and mutual support. Our platform brings neighbors together to 
                create cleaner, safer, and more vibrant neighborhoods where everyone can thrive.
              </p>
              <div className="community-stats">
                <div className="stat">
                  <h3>10,000+</h3>
                  <p>Active Community Members</p>
                </div>
                <div className="stat">
                  <h3>95%</h3>
                  <p>Issue Resolution Rate</p>
                </div>
                <div className="stat">
                  <h3>24/7</h3>
                  <p>Platform Availability</p>
                </div>
              </div>
            </div>
            <div className="community-visual">
              <div className="community-image">
                <img src="/community.webp" alt="Happy community members working together" className="community-img"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vision-mission-section">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vision-card">
              <div className="icon-wrapper">
                <span className="vision-icon">👁️</span>
              </div>
              <h3>Our Vision</h3>
              <p>
                To create seamlessly connected communities where every citizen's voice is heard 
                and municipal services are accessible, transparent, and efficient for all residents.
              </p>
            </div>

            <div className="mission-card">
              <div className="icon-wrapper">
                <span className="mission-icon">🎯</span>
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide an intuitive digital platform that simplifies civic engagement, 
                streamlines issue reporting, and fosters collaborative problem-solving between 
                residents and municipal authorities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h4>Community First</h4>
              <p>We prioritize the needs and voices of our community members in everything we do.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🔍</div>
              <h4>Transparency</h4>
              <p>We believe in open communication and clear processes for all municipal interactions.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h4>Efficiency</h4>
              <p>We streamline processes to ensure quick resolution and effective service delivery.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h4>Sustainability</h4>
              <p>We support sustainable community development and environmental responsibility.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
