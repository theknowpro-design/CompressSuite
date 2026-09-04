import { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import { AppProvider } from "./context/AppContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import FaqSection from "./components/FaqSection.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";

import Results from "./pages/Results.jsx";
import Compressing from "./pages/Compressing.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import About from "./pages/About.jsx";
import Affiliate from "./pages/Affiliate.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Contact from "./pages/Contact.jsx";
import Copyright from "./pages/Copyright.jsx";

function AppContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/compressing" element={<Compressing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/copyright" element={<Copyright />} />
      </Routes>
      <FaqSection />
      <Footer />

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
