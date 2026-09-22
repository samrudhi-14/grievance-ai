"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <style jsx>{`
        .contact-page {
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
        }

        .hero {
          text-align: center;
          padding: 75px 20px 55px;
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
          font-size: clamp(38px, 6vw, 58px);
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
          max-width: 680px;
          margin: 20px auto 0;
          color: #64748b;
          line-height: 1.8;
        }

        .contact-section {
          max-width: 1050px;
          margin: auto;
          padding: 60px 25px 85px;
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 30px;
        }

        .info-card,
        .form-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        }

        .info-card h2,
        .form-card h2 {
          margin: 0 0 12px;
          font-size: 23px;
        }

        .info-card > p,
        .form-card > p {
          color: #64748b;
          line-height: 1.7;
          font-size: 14px;
        }

        .info-item {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }

        .info-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 12px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .info-item strong {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .info-item span {
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 12px 13px;
          font: inherit;
          font-size: 14px;
          outline: none;
          background: white;
        }

        .form-group textarea {
          min-height: 130px;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .submit-btn {
          width: 100%;
          border: none;
          border-radius: 9px;
          padding: 13px;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .success {
          padding: 14px;
          border-radius: 10px;
          background: #ecfdf5;
          color: #047857;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
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

        @media (max-width: 850px) {
          .nav-links {
            display: none;
          }

          .contact-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .navbar {
            padding: 0 20px;
          }

          .nav-buttons .login-btn {
            display: none;
          }

          .contact-section {
            padding-left: 15px;
            padding-right: 15px;
          }

          .info-card,
          .form-card {
            padding: 25px;
          }

          .footer-content {
            flex-direction: column;
          }
        }
      `}</style>

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
          <Link href="/about">About</Link>
          <Link href="/track">Track Grievance</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact" className="active">
            Contact
          </Link>
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

      <section className="hero">
        <div className="badge">✦ GET IN TOUCH</div>

        <h1>
          Contact <span>GrievanceAI</span>
        </h1>

        <p>
          Have a question, need assistance, or want to share feedback?
          Get in touch with the GrievanceAI support team.
        </p>
      </section>

      <section className="contact-section">
        <div className="info-card">
          <h2>Let's Connect</h2>

          <p>
            We're here to help you understand and use the grievance redressal
            platform.
          </p>

          <div className="info-item">
            <div className="info-icon">📧</div>
            <div>
              <strong>Email</strong>
              <span>support@grievanceai.com</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📞</div>
            <div>
              <strong>Support</strong>
              <span>Available through the GrievanceAI platform</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">⏱</div>
            <div>
              <strong>Response</strong>
              <span>We aim to respond to queries as soon as possible.</span>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2>Send Us a Message</h2>

          <p>
            Fill in the form below to share your question or feedback.
          </p>

          {submitted && (
            <div className="success">
              ✓ Your message has been submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we help you?"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message →
            </button>
          </form>
        </div>
      </section>

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
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}