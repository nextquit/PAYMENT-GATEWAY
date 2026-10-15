import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import GalaxyButton from './GalaxyButton';
import './DesktopLandingPage.css';
import {
  ShieldCheck,
  QrCode,
  Lock,
  Volume2,
  Database,
  RefreshCw,
  Star,
  Smartphone,
  MessageSquareText,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Terminal,
  Activity,
  ArrowUpRight,
  Sparkles,
  Send,
  Users,
  Award,
  ChevronDown,
  Check,
  Copy,
  Server,
  Network,
  Rocket,
  Layout,
  Palette,
  Download
} from 'lucide-react';

export default function DesktopLandingPage({
  onOpenFeedbacks,
  hasNewFeedback = false,
  onLaunchApp,
  user
}) {


  // ─── Hero Video Ref ───
  const heroVideoRef = useRef(null);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

  // ─── State for Mobile QR ───
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate dynamic QR code on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.origin;
    QRCode.toDataURL(currentUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch(() => {});
  }, []);


  const handleCopyShareLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };



  return (
    <div className="dlp-root" id="overview">
      {/* ── Background Grid & Orbs ── */}
      <div className="dlp-bg-grid" />
      <div className="dlp-glow-orb dlp-glow-orb-1" />
      <div className="dlp-glow-orb dlp-glow-orb-2" />
      <div className="dlp-glow-orb dlp-glow-orb-3" />

      {/* ── Fixed Navbar ── */}
      <nav className="dlp-nav">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              overflow: 'hidden',
              background: '#090a0d',
              border: '1px solid rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/Hexa.png" alt="HexaPay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Hexa<span style={{ color: '#ef4444' }}>Pay</span>
            </span>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="dlp-nav-actions">
          {/* Feedbacks Button */}
          <GalaxyButton
            shape="pill"
            variant="subtle-green"
            className={hasNewFeedback ? 'review-inner-glow' : ''}
            onClick={onOpenFeedbacks}
            title={hasNewFeedback ? "New judge review received! Click to view" : "View Judges Feedbacks"}
            style={{ transform: 'scale(0.88)' }}
            icon={<MessageSquareText size={15} strokeWidth={2.4} color={hasNewFeedback ? '#fca5a5' : '#86efac'} />}
          >
            Feedbacks
            {hasNewFeedback && (
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                  marginLeft: '5px',
                }}
              />
            )}
          </GalaxyButton>
        </div>
      </nav>

      {/* ── Hero Section with Background Video ── */}
      <section className="dlp-hero-section">
        {/* Ambient Video Background */}
        <div className="dlp-hero-video-wrap" aria-hidden="true">
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="dlp-hero-video"
          >
            <source src="/spac.mp4" type="video/mp4" />
          </video>
          <div className="dlp-hero-video-overlay" />
        </div>

        <div className="dlp-container dlp-hero-wrapper">
          {/* Hackathon Pill */}
          <div className="dlp-tag dlp-tag-red">
            <Sparkles size={14} color="#f87171" />
            <span>IDC 3.0 Hackathon • Real-Time Payment Gateway</span>
          </div>

          {/* Giant Headline */}
          <h1 className="dlp-hero-headline">
            <span className="dlp-hero-line-1">The Next-Gen</span>
            <span className="dlp-hero-line-2 dlp-gradient-text">Instant Payment Gateway</span>
          </h1>

          {/* Subtitle */}
          <p className="dlp-hero-subtitle">
            Engineered from scratch in 24 hours at <strong>IDC 3.0</strong>. Zero-lag UPI-style transactions,
            millisecond PIN authorization, camera QR scanner, live soundbox notifications, and an atomic double-entry banking ledger.
          </p>
        </div>
      </section>



      {/* ── Features Bento Grid ── */}
      <section className="dlp-section" id="features">
        <div className="dlp-container">
          <div className="dlp-section-header">
            <div className="dlp-tag dlp-tag-red">
              <Layers size={14} color="#f87171" />
              <span>Full-Stack Capabilities</span>
            </div>
            <h2 className="dlp-title-lg">Engineered for Velocity & Trust</h2>
            <p className="dlp-desc-muted">
              Every layer of HexaPay was purpose-built to deliver lightning speed without sacrificing cryptographic security or accounting rigor.
            </p>
          </div>

          <div className="dlp-bento-grid">
            {/* Bento 1: QR Scanner */}
            <div className="dlp-bento-card">
              <div>
                <div className="dlp-bento-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <QrCode size={26} color="#ef4444" />
                </div>
                <h3 className="dlp-bento-title">High-Speed Camera QR Scanner</h3>
                <p className="dlp-bento-desc">
                  Real-time video feed analysis utilizing <code>jsQR</code> to decode static and dynamic UPI/HexaPay QR codes with zero frame drop and millisecond payee resolution.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#f87171', fontWeight: 700 }}>
                <span>Sub-15ms QR Decoding</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Bento 2: Cryptographic PIN */}
            <div className="dlp-bento-card">
              <div>
                <div className="dlp-bento-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <Lock size={26} color="#818cf8" />
                </div>
                <h3 className="dlp-bento-title">Cryptographic PIN Gate</h3>
                <p className="dlp-bento-desc">
                  Every debit requires a validated 4-digit PIN hash with client-side salting. Intercepted session tokens cannot issue funds without the PIN key.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#818cf8', fontWeight: 700 }}>
                <span>Zero Replay Attacks</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Bento 3: Soundbox Audio Alerts */}
            <div className="dlp-bento-card">
              <div>
                <div className="dlp-bento-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <Volume2 size={26} color="#fbbf24" />
                </div>
                <h3 className="dlp-bento-title">Instant SoundBox Audio Alerts</h3>
                <p className="dlp-bento-desc">
                  Simulating merchant audio boxes, HexaPay synthesizes sound chimes (TrueCaller ringtone + Web Audio tones) the exact moment money arrives into the wallet.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                <span>Background Audio Priming</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Bento 4: Atomic MongoDB Ledger */}
            <div className="dlp-bento-card">
              <div>
                <div className="dlp-bento-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Database size={26} color="#10b981" />
                </div>
                <h3 className="dlp-bento-title">ACID Double-Entry Ledger</h3>
                <p className="dlp-bento-desc">
                  Financial-grade double-entry transaction journal with atomic MongoDB <code>$inc</code> decrements/increments preventing concurrency race hazards.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                <span>0% Double-Spend Risk</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Bento 5: Real-time Auto Sync */}
            <div className="dlp-bento-card">
              <div>
                <div className="dlp-bento-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <RefreshCw size={26} color="#38bdf8" />
                </div>
                <h3 className="dlp-bento-title">Live State Background Sync</h3>
                <p className="dlp-bento-desc">
                  Intelligent polling and push event listeners update account balances, transaction history, and top-of-screen toast banners without requiring manual page reloads.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                <span>Zero UI Drift</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Bento 6: Live Judge Evaluation */}
            <div className="dlp-bento-card">
              <div>
                <div className="dlp-bento-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <Star size={26} color="#c084fc" />
                </div>
                <h3 className="dlp-bento-title">Real-Time Judge Reviews Engine</h3>
                <p className="dlp-bento-desc">
                  Built specifically for hackathon judging panels to review, rate, and comment with instant sound alerts and live persistent storage across devices.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#c084fc', fontWeight: 700 }}>
                <span>Live Audio Alerts On Review</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Hackathon IDC 3.0 Story Timeline ── */}
      <section className="dlp-section" id="timeline">
        <div className="dlp-container">
          <div className="dlp-section-header">
            <div className="dlp-tag dlp-tag-red">
              <Clock size={14} color="#f87171" />
              <span>The 24-Hour Odyssey</span>
            </div>
            <h2 className="dlp-title-lg">Built Under Pressure at IDC 3.0</h2>
            <p className="dlp-desc-muted">
              From zero lines of code to a production-grade real-time payment gateway within a single 24-hour sprint.
            </p>
          </div>

          <div className="dlp-timeline">
            {[
              {
                hour: '00:00',
                title: 'Problem Statement & Architecture Blueprint',
                desc: 'Unlocked hackathon challenge. Architected double-entry balance schemas, MongoDB transaction isolation, and chosen React 19 + Node.js stack.',
                icon: '💡'
              },
              {
                hour: '06:00',
                title: 'Core Banking Engine & Atomic Locks',
                desc: 'Built atomic balance transfer APIs, double-entry ledger persistence, and simulated banking top-up rails in Express backend.',
                icon: '⚡'
              },
              {
                hour: '12:00',
                title: 'Camera QR Scanner & Mobile-First PWA',
                desc: 'Integrated real-time video QR camera decoding (jsQR), mobile bottom navigation, and dynamic merchant QR generation.',
                icon: '📱'
              },
              {
                hour: '18:00',
                title: 'SoundBox Audio Alerts & Background Sync',
                desc: 'Configured Web Audio API synthesizers and TrueCaller ringtones for merchant audio payment announcements and state polling.',
                icon: '🔊'
              },
              {
                hour: '24:00',
                title: 'Security Hardening, Live Reviews & Final Deploy',
                desc: 'Implemented PIN security gate, anti-tamper protections, judge feedback modal, and zero-downtime deployment for IDC 3.0 evaluation.',
                icon: '🏆'
              },
            ].map((t, idx) => (
              <div key={idx} className="dlp-timeline-item">
                <div className="dlp-timeline-dot">
                  <span>{t.hour}</span>
                </div>
                <div className="dlp-timeline-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      {t.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Developers of This Payment Gateway */}
          <div className="dlp-builders-box" style={{ marginTop: '3.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              The Builders
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
              Developers of This Payment Gateway
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', maxWidth: '580px', margin: '0 auto 2.2rem auto', lineHeight: 1.5 }}>
              Architected and engineered from scratch in 24 hours at IDC 3.0 Hackathon.
            </p>

            {/* Developer 3D Flip Cards */}
            <div className="dlp-dev-grid">
              {/* Card 1: Anubhav Tiwari */}
              <div className="dlp-dev-card-wrapper">
                <div className="dlp-dev-card-inner">
                  {/* Front Side: Photo & Info */}
                  <div className="dlp-dev-card-front">
                    <img
                      src="/anubhav.png"
                      alt="Anubhav Tiwari"
                      className="dlp-dev-card-img"
                    />
                    <div className="dlp-dev-card-overlay">
                      <div className="dlp-dev-card-name">Anubhav Tiwari</div>
                      <div className="dlp-dev-card-role">Backend • API Integration • Deployment</div>
                      <div className="dlp-dev-flip-hint">
                        <span>Hover to inspect stack</span>
                        <span>↻</span>
                      </div>
                    </div>
                  </div>

                  {/* Back Side: Tech Stack Showcase */}
                  <div className="dlp-dev-card-back">
                    <div className="dlp-dev-back-top">
                      <div>
                        <div className="dlp-dev-back-title">Anubhav Tiwari</div>
                        <div className="dlp-dev-back-role">Backend • API Integration • Deployment</div>
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>👨‍💻</span>
                    </div>

                    <div>
                      <div className="dlp-dev-back-section-label">Core Tech Stack</div>
                      <div className="dlp-dev-stack-tags">
                        <div className="dlp-stack-tag dlp-stack-tag-backend">
                          <Server size={15} className="dlp-stack-icon" />
                          <span>Backend</span>
                        </div>
                        <div className="dlp-stack-tag dlp-stack-tag-api">
                          <Network size={15} className="dlp-stack-icon" />
                          <span>API Integration</span>
                        </div>
                        <div className="dlp-stack-tag dlp-stack-tag-deploy">
                          <Rocket size={15} className="dlp-stack-icon" />
                          <span>Deployment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Palak Singh */}
              <div className="dlp-dev-card-wrapper">
                <div className="dlp-dev-card-inner">
                  {/* Front Side: Photo & Info */}
                  <div className="dlp-dev-card-front">
                    <img
                      src="/palak.png"
                      alt="Palak Singh"
                      className="dlp-dev-card-img"
                    />
                    <div className="dlp-dev-card-overlay">
                      <div className="dlp-dev-card-name">Palak Singh</div>
                      <div className="dlp-dev-card-role">Frontend • UI/UX Design • MongoDB Setup</div>
                      <div className="dlp-dev-flip-hint">
                        <span>Hover to inspect stack</span>
                        <span>↻</span>
                      </div>
                    </div>
                  </div>

                  {/* Back Side: Tech Stack Showcase */}
                  <div className="dlp-dev-card-back">
                    <div className="dlp-dev-back-top">
                      <div>
                        <div className="dlp-dev-back-title">Palak Singh</div>
                        <div className="dlp-dev-back-role">Frontend • UI/UX Design • MongoDB Setup</div>
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>🎨</span>
                    </div>

                    <div>
                      <div className="dlp-dev-back-section-label">Core Tech Stack</div>
                      <div className="dlp-dev-stack-tags">
                        <div className="dlp-stack-tag dlp-stack-tag-frontend">
                          <Layout size={15} className="dlp-stack-icon" />
                          <span>Frontend</span>
                        </div>
                        <div className="dlp-stack-tag dlp-stack-tag-design">
                          <Palette size={15} className="dlp-stack-icon" />
                          <span>UI/UX Design</span>
                        </div>
                        <div className="dlp-stack-tag dlp-stack-tag-database">
                          <Database size={15} className="dlp-stack-icon" />
                          <span>MongoDB Setup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile Experience Showcase & QR Code ── */}
      <section className="dlp-section" id="mobile-access">
        <div className="dlp-container">
          <div className="dlp-mobile-showcase">
            <div>
              <div className="dlp-tag dlp-tag-emerald">
                <Smartphone size={14} color="#6ee7b7" />
                <span>Mobile PWA Experience</span>
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: '1rem' }}>
                Scan to Open on Your Smartphone
              </h2>

              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.6, marginBottom: '2rem' }}>
                HexaPay was crafted mobile-first with native vibration haptics, camera QR scanning, PIN authorization keypad,
                and instant soundbox ringtone alerts. Point your phone camera at this QR code right now!
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={handleCopyShareLink} className="dlp-btn-secondary">
                  {copiedLink ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy App URL'}</span>
                </button>

                <a
                  href="/HexaPay.apk"
                  download="HexaPay.apk"
                  className="dlp-btn-primary"
                  style={{ textDecoration: 'none' }}
                  title="Direct Download HexaPay Android APK"
                >
                  <Download size={16} />
                  <span>Download APK</span>
                </a>
              </div>
            </div>

            {/* QR Code Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Open HexaPay on Mobile"
                  style={{ width: '220px', height: '220px', borderRadius: '12px' }}
                />
              ) : (
                <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  Generating QR...
                </div>
              )}
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', fontWeight: 800, color: '#090a0d' }}>
                Scan with Phone Camera
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Instant Mobile PWA Launch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="dlp-footer">
        <div className="dlp-container">
          <div className="dlp-footer-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#090a0d',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <img src="/Hexa.png" alt="HexaPay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                Hexa<span style={{ color: '#ef4444' }}>Pay</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginLeft: '1rem' }}>
                Built at IDC 3.0 Hackathon • All Rights Reserved
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <a href="#features" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Features</a>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
