"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: Inter, Arial, sans-serif;
        }

        .navbar {
          height: 76px;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7%;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(12px);
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #0f172a;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 21px;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
        }

        .logo-text strong {
          display: block;
          font-size: 19px;
          font-weight: 800;
        }

        .logo-text span {
          font-size: 11px;
          color: #64748b;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-links a {
          text-decoration: none;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: #2563eb;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .login-btn,
        .register-btn {
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
        }

        .login-btn {
          color: #2563eb;
        }

        .register-btn {
          color: white;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          box-shadow: 0 5px 15px rgba(37, 99, 235, 0.2);
        }

        .hero {
          text-align: center;
          padding: 90px 20px 70px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(37, 99, 235, 0.12),
              transparent 45%
            ),
            #f8fafc;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #eff6ff;
          color: #2563eb;
          padding: 8px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(38px, 6vw, 62px);
          line-height: 1.05;
          letter-spacing: -2px;
          font-weight: 850;
        }

        .hero h1 span {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          max-width: 720px;
          margin: 22px auto 0;
          color: #64748b;
          line-height: 1.8;
          font-size: 16px;
        }

        .section {
          max-width: 1150px;
          margin: auto;
          padding: 75px 25px;
        }

        .section-title {
          text-align: center;
          margin-bottom: 45px;
        }

        .section-title h2 {
          margin: 0 0 12px;
          font-size: 32px;
          font-weight: 800;
        }

        .section-title p {
          color: #64748b;
          max-width: 650px;
          margin: auto;
          line-height: 1.7;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: stretch;
        }

        .mission-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .mission-card h3 {
          margin: 0 0 15px;
          font-size: 23px;
        }

        .mission-card p {
          color: #64748b;
          line-height: 1.8;
          margin: 0;
        }

        .icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .feature-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 25px;
          transition: 0.25s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
        }

        .feature-card h3 {
          font-size: 17px;
          margin: 0 0 10px;
        }

        .feature-card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
          margin: 0;
        }

        .how-section {
          background: #0f172a;
          color: white;
          max-width: none;
        }

        .how-inner {
          max-width: 1150px;
          margin: auto;
          padding: 75px 25px;
        }

        .how-inner .section-title p {
          color: #94a3b8;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
        }

        .step {
          position: relative;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .step h3 {
          margin: 0 0 10px;
          font-size: 17px;
        }

        .step p {
          margin: 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.7;
        }

        .cta {
          margin: 70px auto;
          max-width: 1000px;
          padding: 55px 30px;
          text-align: center;
          border-radius: 25px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          box-shadow: 0 20px 50px rgba(37, 99, 235, 0.25);
        }

        .cta h2 {
          margin: 0 0 12px;
          font-size: 30px;
        }

        .cta p {
          max-width: 600px;
          margin: 0 auto 25px;
          line-height: 1.7;
          color: #dbeafe;
        }

        .cta-btn {
          display: inline-block;
          background: white;
          color: #2563eb;
          padding: 13px 25px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 800;
          font-size: 14px;
        }

        .footer {
          background: #020617;
          color: white;
          padding: 45px 7%;
        }

        .footer-content {
          max-width: 1150px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        .footer p {
          color: #94a3b8;
          font-size: 13px;
          margin: 8px 0 0;
        }

        .footer-links {
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
        }

        .footer-links a:hover {
          color: white;
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }

          .mission-grid {
            grid-template-columns: 1fr;
          }

          .features,
          .steps {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .navbar {
            padding: 0 20px;
          }

          .nav-buttons .login-btn {
            display: none;
          }

          .features,
          .steps {
            grid-template-columns: 1fr;
          }

          .hero {
            padding-top: 60px;
          }

          .footer-content {
            flex-direction: column;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <Link href="/" className="logo-area">
          <div className="logo-icon">🛡</div>

          <div className="logo-text">
            <strong>GrievanceAI</strong>
            <span>Redressal System</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about" className="active">
            About
          </Link>
          <Link href="/track">Track Grievance</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="nav-buttons">
          <Link href="/login" className="login-btn">
            Login
          </Link>

          <Link href="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="badge">✦ ABOUT GRIEVANCEAI</div>

        <h1>
          Making Every <span>Voice Heard.</span>
        </h1>

        <p>
          GrievanceAI is an AI-powered grievance redressal platform designed
          to make reporting civic and public issues easier, faster, and more
          transparent.
        </p>
      </section>

      {/* MISSION */}
      <section className="section">
        <div className="section-title">
          <h2>Our Mission</h2>

          <p>
            We aim to bridge the gap between citizens and authorities through
            technology, transparency, and intelligent grievance management.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="icon">🎯</div>

            <h3>Our Purpose</h3>

            <p>
              Citizens often face difficulties when reporting everyday issues
              such as sanitation problems, damaged roads, water supply,
              electricity, food safety, education, and public safety.
              GrievanceAI provides a centralized platform where these issues
              can be submitted and tracked conveniently.
            </p>
          </div>

          <div className="mission-card">
            <div className="icon">🤖</div>

            <h3>Why AI?</h3>

            <p>
              Artificial intelligence can help organize grievances by
              identifying their category, priority, department, and summary.
              This can help reduce manual classification and make the
              grievance management process more organized.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="section-title">
          <h2>What GrievanceAI Offers</h2>

          <p>
            A complete digital workflow for citizens and administrators.
          </p>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="icon">📝</div>
            <h3>Easy Submission</h3>
            <p>
              Submit grievances online with descriptions, categories,
              locations, and supporting evidence.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🤖</div>
            <h3>AI Classification</h3>
            <p>
              AI can assist in identifying the grievance category, priority,
              department, and summary.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📍</div>
            <h3>Live Tracking</h3>
            <p>
              Citizens can track the progress of their grievance through
              different resolution stages.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🔐</div>
            <h3>Secure System</h3>
            <p>
              User accounts and grievance information are managed through a
              structured authentication and database system.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-title">
            <h2>How It Works</h2>

            <p>
              GrievanceAI connects citizens and administrators through a
              simple digital workflow.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>
                Create an account to securely access the grievance system.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Submit</h3>
              <p>
                Describe your issue and provide relevant supporting
                information or evidence.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>AI Analysis</h3>
              <p>
                The system can analyze and classify the grievance to assist
                with appropriate routing.
              </p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Resolution</h3>
              <p>
                Monitor the grievance as it moves through the resolution
                process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Have an Issue to Report?</h2>

        <p>
          Register with GrievanceAI and submit your grievance through a simple
          and transparent digital process.
        </p>

        <Link href="/register" className="cta-btn">
          Get Started →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <strong>GrievanceAI</strong>
            <p>AI-Powered Online Grievance Redressal System</p>
          </div>

          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/track">Track</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}