"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "What is GrievanceAI?",
    answer:
      "GrievanceAI is an AI-powered online grievance redressal system that allows citizens to submit, track, and manage public grievances through a centralized digital platform.",
  },
  {
    question: "How do I submit a grievance?",
    answer:
      "Create an account or log in, open the Submit Grievance section, describe your issue, select or confirm the relevant information, and submit your grievance.",
  },
  {
    question: "What types of grievances can I report?",
    answer:
      "You can report issues related to Garbage & Sanitation, Roads & Traffic, Water Supply, Electricity, Food Security & Safety, Public Safety, Education, and Other civic concerns.",
  },
  {
    question: "How does the AI help with my grievance?",
    answer:
      "The AI can assist in analyzing a grievance and identifying its category, priority, relevant department, and a concise summary. The system can also use fallback classification when AI assistance is unavailable.",
  },
  {
    question: "How can I track my grievance?",
    answer:
      "Use the Track Grievance section and enter your grievance ID. The system displays the available grievance information and its current progress.",
  },
  {
    question: "What is a grievance ID?",
    answer:
      "A grievance ID is the unique reference number assigned to your complaint after submission. It can be used to identify and track your grievance.",
  },
  {
    question: "What are the grievance status stages?",
    answer:
      "A grievance can move through stages such as Submitted, Assigned, Under Investigation, In Progress, and Resolved. A grievance may also be marked Rejected when applicable.",
  },
  {
    question: "Can I upload evidence?",
    answer:
      "Yes. Supporting evidence such as JPG, JPEG, PNG images or PDF documents can be attached where the upload feature is available.",
  },
  {
    question: "Is my information secure?",
    answer:
      "GrievanceAI is designed with user authentication and controlled access so that grievance information can be managed securely.",
  },
  {
    question: "What should I do if I cannot track my grievance?",
    answer:
      "First check that you have entered the correct grievance ID. If the problem continues, contact the appropriate support channel provided by the system.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="faq-page">
      <style jsx>{`
        .faq-page {
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
          padding: 80px 20px 60px;
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
          font-size: 16px;
        }

        .faq-section {
          max-width: 900px;
          margin: auto;
          padding: 60px 25px 80px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .faq-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
        }

        .faq-question {
          width: 100%;
          border: none;
          background: white;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          color: #0f172a;
          font-size: 15px;
          font-weight: 750;
        }

        .faq-question:hover {
          background: #f8fafc;
        }

        .arrow {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          transition: transform 0.25s;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 24px 22px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.8;
        }

        .help-box {
          margin-top: 45px;
          padding: 35px;
          border-radius: 20px;
          text-align: center;
          background: linear-gradient(135deg, #eff6ff, #eef2ff);
          border: 1px solid #dbeafe;
        }

        .help-box h2 {
          margin: 0 0 10px;
          font-size: 24px;
        }

        .help-box p {
          color: #64748b;
          margin: 0 auto 22px;
          line-height: 1.7;
        }

        .contact-btn {
          display: inline-block;
          text-decoration: none;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          color: white;
          padding: 12px 22px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 750;
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
        }

        @media (max-width: 600px) {
          .navbar {
            padding: 0 20px;
          }

          .nav-buttons .login-btn {
            display: none;
          }

          .hero {
            padding-top: 60px;
          }

          .faq-section {
            padding-left: 15px;
            padding-right: 15px;
          }

          .faq-question {
            padding: 18px;
          }

          .faq-answer {
            padding-left: 18px;
            padding-right: 18px;
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
          <Link href="/about">About</Link>
          <Link href="/track">Track Grievance</Link>
          <Link href="/faq" className="active">
            FAQ
          </Link>
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
        <div className="badge">✦ HELP CENTER</div>

        <h1>
          Frequently Asked <span>Questions</span>
        </h1>

        <p>
          Find answers to common questions about submitting, tracking, and
          managing grievances through GrievanceAI.
        </p>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.question}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>

                <span
                  className={`arrow ${
                    openIndex === index ? "open" : ""
                  }`}
                >
                  ↓
                </span>
              </button>

              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>

        <div className="help-box">
          <h2>Still Have Questions?</h2>

          <p>
            If you need additional assistance, you can reach out through the
            contact section of GrievanceAI.
          </p>

          <Link href="/contact" className="contact-btn">
            Contact Us →
          </Link>
        </div>
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