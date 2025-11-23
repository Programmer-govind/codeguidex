'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin login page
  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <footer className="footer-enhanced">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <h3 className="footer-company-title">CodeGuideX</h3>
            <p className="footer-company-description">
              A beginner-friendly platform to post doubts, join communities, interact with mentors, and attend live video sessions.
            </p>
            <p className="footer-company-tagline">
              Learn, Connect, Grow
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/communities" className="footer-link">
                  Communities
                </Link>
              </li>
              <li>
                <Link href="/search" className="footer-link">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-section-title">Legal</h4>
            <ul className="footer-links">
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li className="mt-4">
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright text-center font-medium">
            © 2025 CodeGuideX. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <Link href="/privacy" className="footer-bottom-link">
              Privacy
            </Link>
            <Link href="/terms" className="footer-bottom-link ml-12">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}