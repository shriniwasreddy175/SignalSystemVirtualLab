function Sidebar({ page, setPage, menuOpen, setMenuOpen }) {

  return (

    <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}>

      <div className="sidebar-title">
        Virtual Lab
      </div>


      <ul className="sidebar-menu">

        <li
          className={
            page === "home"
              ? "active"
              : ""
          }
          onClick={() => {
            setPage("home");
            setMenuOpen(false);
          }}
        >
          🏠 Home
        </li>


        <li
          className={
            page === "generator"
              ? "active"
              : ""
          }
          onClick={() => {
            setPage("generator");
            setMenuOpen(false);
          }}
        >
          📈 Signal Generator
        </li>

        <li
          className={
            page === "operations"
              ? "active"
              : ""
          }
          onClick={() => {
            setPage("operations");
            setMenuOpen(false);
          }}
        >
          🔄 Signal Operations
        </li>


        <li
          className={
            page === "analysis"
              ? "active"
              : ""
          }
          onClick={() => {
            setPage("analysis");
            setMenuOpen(false);
          }}
        >
          📊 Analysis
        </li>


      </ul>

    </aside>

  );
}

export default Sidebar;