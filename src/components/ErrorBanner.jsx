import { ERROR_MESSAGES } from "../utils/errorMessages";

function ErrorBanner({ errorKey }) {
  const error = ERROR_MESSAGES[errorKey];
  if (!error) {
    return null;
  }

  return (
    <aside className="error-banner" role="alert">
      <strong>{error.title}</strong>
      <p>{error.detail}</p>
    </aside>
  );
}

export default ErrorBanner;
