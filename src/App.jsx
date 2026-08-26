import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import FaqSection from "./components/FaqSection.jsx";
import Footer from "./components/Footer.jsx";
import FooterModal from "./components/FooterModal.jsx";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Results from "./pages/Results.jsx";

function AppContent() {
  const { theme } = useApp();
  const [showFooterModal, setShowFooterModal] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleOpenModal = (section = "about") => {
    setActiveSection(section);
    setShowFooterModal(true);
  };

  const handleCloseModal = () => {
    setShowFooterModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      <FaqSection />
      <Footer onLinkClick={handleOpenModal} />

      {/* Scroll-to-Top Button - Fixed bottom-right */}
      {showScrollTop && (
        <button
          className="scroll-to-top-button"
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          title="Back to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}

      {/* Footer Modal */}
      <FooterModal
        isOpen={showFooterModal}
        onClose={handleCloseModal}
        darkMode={theme === "dark"}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
