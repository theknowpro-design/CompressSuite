import { useState, useEffect, useRef, useCallback } from "react";
import { FiShield, FiFileText, FiMail, FiX, FiInfo } from "react-icons/fi";
import "../styles/footerModal.css";

/**
 * Footer Modal Content
 * Markdown-like content for each section
 */
const FOOTER_CONTENT = {
  about: {
    title: "About CompressSuite",
    icon: FiInfo,
    content: `CompressSuite is a fast, modern media compression tool built for creators, entrepreneurs, and everyday users who need smaller files without losing quality. Our mission is to make compression effortless, accessible, and lightning‑quick — whether you're optimizing images for a website, shrinking videos for social media, or preparing files for storage.

CompressSuite runs on a streamlined, browser‑based engine with no installs, no sign‑ups, and no friction. Just drag, drop, and compress.`,
  },
  affiliate: {
    title: "Affiliate Disclosure",
    icon: FiFileText,
    content: `Some links on CompressSuite may be affiliate links. This means we may earn a commission if you choose to make a purchase through these links — at no additional cost to you.

We only recommend tools, services, and products that we genuinely believe provide value. Any commissions earned help support the ongoing development and maintenance of CompressSuite.

If you have questions about our affiliate relationships, contact us at info@compresssuite.com.`,
  },
  privacy: {
    title: "Privacy Policy",
    icon: FiShield,
    content: `Your privacy matters. CompressSuite does not store, analyze, or retain the files you upload. All compression happens directly in your browser or through secure, temporary processing. Once your session ends, your files are gone permanently.

We do not sell your data, share your data, or track personal information beyond basic analytics used to improve performance. By using CompressSuite, you agree to responsible use of the platform and acknowledge that compressed files are provided as‑is.

For privacy questions, contact us at info@compresssuite.com.`,
  },
  terms: {
    title: "Terms of Service",
    icon: FiFileText,
    content: `By using CompressSuite, you agree to use the platform responsibly and only for lawful purposes. You retain full ownership of any files you upload. CompressSuite provides compression tools "as‑is" without warranties of any kind, including performance guarantees or fitness for a particular purpose.

We are not liable for data loss, corrupted files, or misuse of the platform. You are responsible for verifying the integrity of your compressed files before distributing or storing them.

Continued use of CompressSuite constitutes acceptance of these terms.`,
  },
  contact: {
    title: "Contact",
    icon: FiMail,
    content: `Mindful Internetpreneur
6311 Ames Ave
Unit #345
Omaha, NE 68104

Email: info@compresssuite.com

For partnership inquiries, feature requests, or bug reports, reach out anytime.`,
  },
  disclaimer: {
    title: "Disclaimer",
    icon: FiShield,
    content: `CompressSuite is a utility tool designed to help users reduce file sizes. While we aim for high‑quality results, compression may alter visual or audio fidelity depending on the file type and settings. Always keep backups of your original files.`,
  },
  copyright: {
    title: "Copyright",
    icon: FiFileText,
    content: `© 2026 CompressSuite. All rights reserved.
Unauthorized reproduction, distribution, or modification of this software or its content is prohibited.`,
  },
};

const SECTION_ORDER = ["about", "affiliate", "privacy", "terms", "disclaimer", "contact", "copyright"];

/**
 * FooterModal Component
 * Premium modal displaying footer information with contact details
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback to close modal
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @param {string} props.activeSection - Currently active section key
 * @param {Function} props.onSectionChange - Callback when section changes
 */
function FooterModal({ isOpen, onClose, darkMode = false, activeSection = "about", onSectionChange }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const tabsRef = useRef(null);
  const tabRefs = useRef({});
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const modalRef = useRef(null);
  const triggerElementRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Clear any pending close timeout when modal is reopened
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setIsAnimating(true);
      setIsClosing(false);

      // Store the element that triggered the modal open (document.activeElement)
      triggerElementRef.current = document.activeElement;

      // Make background inert
      document.body.inert = true;

      // Focus the modal after it renders
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 0);
    } else {
      // When isOpen becomes false, ensure isAnimating is also false
      // This handles external closes (not through handleClose())
      // For internal closes via handleClose(), isAnimating is already false
      setIsAnimating(false);
      setIsClosing(false);

      // Remove inert from background
      document.body.inert = false;

      // Restore focus to the element that opened the modal
      if (triggerElementRef.current && triggerElementRef.current.focus) {
        triggerElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Cleanup on unmount — clear any pending close timeout
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      document.body.inert = false;
    };
  }, []);

  // Handle Escape key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isClosing) {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isClosing]);

  // Auto-scroll tab bar to active section
  useEffect(() => {
    if (tabsRef.current && tabRefs.current[activeSection]) {
      const tabElement = tabRefs.current[activeSection];
      const tabsContainer = tabsRef.current;

      // Calculate scroll position to center the active tab
      const tabOffsetLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = tabsContainer.clientWidth;
      const scrollLeft = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

      tabsContainer.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeSection]);

  // Reset scroll position when active section changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [activeSection]);

  // Memoize scroll handler to maintain stable function reference for addEventListener/removeEventListener
  const handleContentScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      setScrollProgress(Math.min(progress, 1) * 100);
    }
  }, []);

  // Track scroll progress in modal content
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      el.addEventListener("scroll", handleContentScroll);
    }

    return () => {
      el.removeEventListener("scroll", handleContentScroll);
    };
  }, [isOpen]);

  const handleClose = () => {
    // Prevent multiple close calls
    if (isClosing) return;

    setIsClosing(true);

    // Clear any existing timeout before setting a new one
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Immediately set isAnimating=false to trigger CSS close animation
    // This ensures the animation starts right away without delay
    setIsAnimating(false);

    // After animation duration, remove the component from DOM via onClose()
    // This allows the CSS transition to complete before unmounting
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
      closeTimeoutRef.current = null;
    }, 500);
  };

  const handleSectionClick = (sectionKey) => {
    onSectionChange?.(sectionKey);
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  const currentContent = FOOTER_CONTENT[activeSection];
  const CurrentIcon = currentContent?.icon || FiInfo;

  return (
    <div 
      className={`footer-modal-overlay ${isAnimating ? "active" : ""}`}
      style={{ pointerEvents: isClosing ? "none" : "auto" }}
      onClick={() => !isClosing && handleClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="footer-modal-title"
        tabIndex={-1}
        className={`footer-modal-container ${isAnimating ? "slide-up" : ""} ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="footer-modal-close" onClick={handleClose} aria-label="Close modal">
          <FiX size={24} />
        </button>

        {/* Header */}
        <div className="footer-modal-header">
          <h2 id="footer-modal-title">CompressSuite</h2>
          <p className="footer-modal-tagline">Information & Legal</p>
        </div>

        {/* Navigation Tabs */}
        <div className="footer-modal-tabs" ref={tabsRef}>
          {SECTION_ORDER.map((sectionKey) => (
            <button
              key={sectionKey}
              ref={(el) => {
                if (el) tabRefs.current[sectionKey] = el;
              }}
              className={`footer-modal-tab ${activeSection === sectionKey ? "active" : ""}`}
              onClick={() => handleSectionClick(sectionKey)}
              aria-pressed={activeSection === sectionKey}
              aria-label={`View ${FOOTER_CONTENT[sectionKey]?.title}`}
            >
              {FOOTER_CONTENT[sectionKey]?.title}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="footer-modal-content" ref={contentRef}>
          {/* Scroll Progress Indicator */}
          <div
            ref={progressBarRef}
            className="footer-modal-progress-bar"
            style={{
              width: `${scrollProgress}%`,
            }}
            aria-hidden="true"
          />

          <section className="footer-modal-section active-section">
            <div className="section-header">
              <CurrentIcon className="section-icon" />
              <h3>{currentContent?.title}</h3>
            </div>
            <div className="section-body">
              {(currentContent?.content?.split("\n\n") ?? []).map((paragraph, idx) => (
                <p key={idx} className="section-paragraph">
                  {paragraph.split("\n").map((line, lineIdx, lines) => (
                    <span key={`line-${idx}-${lineIdx}`}>
                      {line}
                      {lineIdx < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="footer-modal-footer">
          <p>CompressSuite — Fast, Free, Private Media Compression</p>
        </div>
      </div>
    </div>
  );
}

export default FooterModal;
