import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { personal } from '../data/content';

interface Props {
  showToast: (msg: string) => void;
}

export default function Contact({ showToast }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /*
     * FORMSPREE / BACKEND INTEGRATION NOTE:
     * To integrate Formspree or an email backend:
     * 1. Register at formspree.io and get your endpoint (e.g. https://formspree.io/f/{id})
     * 2. Replace this mailto dispatch with a fetch POST request:
     *    fetch("https://formspree.io/f/YOUR_ID", {
     *      method: "POST",
     *      headers: { "Content-Type": "application/json" },
     *      body: JSON.stringify(form)
     *    })
     */
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${form.subject || 'Opportunity / Discussion'}`);
    const mailtoBody = encodeURIComponent(
      `Hello Shailesh,\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n`
    );
    window.location.href = `mailto:${personal.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
    showToast('Opening your default email client...');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    showToast('Email address copied to clipboard!');
  };

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <div>
          <div className="cell-header">In [6]: # Dispatch Connection</div>
          <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>
            Get In Touch
          </h2>
          <p style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '3rem' }}>
            # Open to ML / Data Science internships, full-time junior roles, remote or on-site anywhere.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Direct Information Details */}
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="heading-md" style={{ marginBottom: '0.75rem' }}>
                  Let's explore what the data says.
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                  Whether you're looking for an intern who verifies data leakage before fitting, needs assistance prototyping RAG solutions, or want to discuss machine learning applications, my inbox is open.
                </p>
              </div>

              {/* Direct Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {/* Email with copy button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                      DIRECT EMAIL
                    </div>
                    <a
                      href={`mailto:${personal.email}`}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}
                    >
                      {personal.email}
                    </a>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    Copy
                  </button>
                </div>

                {/* Phone */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                    PHONE / WHATSAPP
                  </div>
                  <a
                    href={`tel:${personal.phone}`}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}
                  >
                    {personal.phone}
                  </a>
                </div>

                {/* Resume Download */}
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Shailesh Patil Resume</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      PDF Format • Updated 2026
                    </div>
                  </div>
                  <a
                    href={personal.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                  >
                    Download PDF ↓
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  GitHub ↗
                </a>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  LinkedIn ↗
                </a>
                <a
                  href={personal.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  Instagram ↗
                </a>
              </div>
            </div>

            {/* Interactive Mail Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>
                Send a Message
              </h3>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
                  SUBJECT
                </label>
                <input
                  type="text"
                  placeholder="e.g. ML Intern Opportunity / Collaboration"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
                  MESSAGE
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your note or project requirements..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Send Dispatch ↗
              </button>
            </motion.form>
          </div>

          <div className="cell-header" style={{ marginTop: '2.5rem', color: 'var(--text-tertiary)', opacity: 0.5 }}>
            Out [6]: Communication socket ready.
          </div>
        </div>
      </div>
    </section>
  );
}
