function Footer({ onLinkClick }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("about")}
          aria-label="About CompressSuite"
        >
          About
        </button>
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("affiliate")}
          aria-label="Affiliate Disclosure"
        >
          Affiliate Disclosure
        </button>
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("privacy")}
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </button>
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("terms")}
          aria-label="Terms of Service"
        >
          Terms of Service
        </button>
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("disclaimer")}
          aria-label="Disclaimer"
        >
          Disclaimer
        </button>
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("contact")}
          aria-label="Contact Information"
        >
          Contact
        </button>
        <button
          className="footer-nav-button"
          onClick={() => onLinkClick?.("copyright")}
          aria-label="Copyright Information"
        >
          Copyright
        </button>
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
