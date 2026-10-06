function Navbar({ menuOpen, setMenuOpen }) {
  return (
    <nav className="navbar">
      <button
        className="navbar-menu-button"
        type="button"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className="navbar-logo">
        📡 SS Virtual Lab
      </div>

      <div className="navbar-subtitle">
        Signals & Systems
      </div>
    </nav>
  );
}

export default Navbar;