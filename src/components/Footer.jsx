function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <a
          className="footer-nav-button"
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="About CompressSuite"
        >
          About
        </a>
        <a
          className="footer-nav-button"
          href="/affiliate"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Affiliate Disclosure"
        >
          Affiliate Disclosure
        </a>
        <a
          className="footer-nav-button"
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </a>
        <a
          className="footer-nav-button"
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Terms of Service"
        >
          Terms of Service
        </a>
        <a
          className="footer-nav-button"
          href="/disclaimer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Disclaimer"
        >
          Disclaimer
        </a>
        <a
          className="footer-nav-button"
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Information"
        >
          Contact
        </a>
        <a
          className="footer-nav-button"
          href="/copyright"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Copyright Information"
        >
          Copyright
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
