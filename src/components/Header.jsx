import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Logo from "./Logo.jsx";

function formatDateTime(date) {
  const datePart = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${datePart} • ${timePart}`;
}

function Header() {
  const { theme, toggleTheme, isCompressing } = useApp();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="app-header">
      <Logo compressing={isCompressing} />
      <span className="app-header__title">CompressSuite</span>
      <span className="app-header__free">Always Free</span>
      <time dateTime={now.toISOString()} className="app-header__time">
        {formatDateTime(now)}
      </time>
      <nav>
        <ul className="app-header__nav">
          <li>
            <Link to="/">Image Compression</Link>
          </li>
          <li>
            <Link to="/">Video Compression</Link>
          </li>
          <li>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light/dark theme"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
