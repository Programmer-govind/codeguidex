import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - CodeGuideX',
  description: 'Privacy Policy for CodeGuideX platform',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-container">
      {/* Header */}
      <div className="legal-header">
        <Link href="/" className="legal-back-link">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to CodeGuideX
        </Link>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-subtitle">Last updated: November 21, 2025</p>
      </div>

      {/* Content */}
      <div className="legal-content">
        <section className="legal-section">
          <h2 className="legal-section-title">1. Introduction</h2>
          <p className="legal-text">
            Welcome to CodeGuideX ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">2. Information We Collect</h2>
          <h3 className="legal-subsection-title">2.1 Personal Information</h3>
          <p className="legal-text mb-4">
            We may collect personal information that you provide directly to us, including:
          </p>
          <ul className="legal-list mb-4">
            <li>Name and contact information (email address)</li>
            <li>Profile information (display name, bio, skills)</li>
            <li>Account credentials (username, password)</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="legal-subsection-title">2.2 Usage Information</h3>
          <p className="legal-text">
            We automatically collect certain information about your use of our platform, including:
          </p>
          <ul className="legal-list">
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Pages visited and time spent on our platform</li>
            <li>Search queries and interaction data</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">3. How We Use Your Information</h2>
          <p className="legal-text mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="legal-list">
            <li>Providing and maintaining our platform</li>
            <li>Creating and managing your account</li>
            <li>Facilitating connections between students and mentors</li>
            <li>Sending you important updates and notifications</li>
            <li>Improving our platform and developing new features</li>
            <li>Ensuring platform security and preventing fraud</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">4. Information Sharing</h2>
          <p className="legal-text mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
          </p>
          <ul className="legal-list">
            <li>With service providers who assist us in operating our platform</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or acquisition</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">5. Data Security</h2>
          <p className="legal-text">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">6. Your Rights</h2>
          <p className="legal-text mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="legal-list">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction or objection to processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">7. Cookies and Tracking</h2>
          <p className="legal-text">
            We use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser preferences, though disabling cookies may affect platform functionality.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">8. Children's Privacy</h2>
          <p className="legal-text">
            Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">9. Changes to This Policy</h2>
          <p className="legal-text">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">10. Contact Us</h2>
          <p className="legal-text">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div className="legal-contact">
            <p className="legal-text">
              <strong>Email:</strong> privacy@codeguidex.com<br />
              <strong>Address:</strong> CodeGuideX Privacy Team
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="legal-footer">
        <Link href="/" className="legal-footer-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
}