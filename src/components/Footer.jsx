function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <a href="https://mindfulinternetp.com/affiliate-disclosure" target="_blank" rel="noopener noreferrer">
          Affiliate Disclosure
        </a>
        <a href="https://mindfulinternetp.com/privacy-policy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
        <a href="https://mindfulinternetp.com/terms-of-use" target="_blank" rel="noopener noreferrer">
          Terms of Use
        </a>
        <a href="https://mindfulinternetp.com/disclaimer" target="_blank" rel="noopener noreferrer">
          Disclaimer
        </a>
        <a href="https://mindfulinternetp.com/accessibility-statement" target="_blank" rel="noopener noreferrer">
          Accessibility Statement
        </a>
        <a href="https://mindfulinternetp.com/contact" target="_blank" rel="noopener noreferrer">
          Contact
        </a>
      </nav>
      <p className="footer-copyright">
        © {currentYear}{" "}
        <a href="https://mindfulinternetpreneur.com" target="_blank" rel="noopener noreferrer">
          Mindful Internetpreneur
        </a>
      </p>
    </footer>
  );
}

export default Footer;
