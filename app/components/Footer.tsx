export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-2 mb-md-0 small">
              <i className="bi bi-house-door-fill me-2"></i>
              <strong>Athens Real Estate</strong> - Ακίνητα στην Αθήνα
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 small text-muted">
              © {currentYear} Athens Real Estate | CLD6001 Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}