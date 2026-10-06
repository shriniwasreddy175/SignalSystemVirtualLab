function Sidebar({ page, setPage }) {

  return (

    <aside className="sidebar">

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
          onClick={() => setPage("home")}
        >
          🏠 Home
        </li>


        <li
          className={
            page === "generator"
              ? "active"
              : ""
          }
          onClick={() => setPage("generator")}
        >
          📈 Signal Generator
        </li>

        <li
          className={
            page === "operations"
              ? "active"
              : ""
          }
          onClick={() => setPage("operations")}
        >
          🔄 Signal Operations
        </li>


        <li
          className={
            page === "analysis"
              ? "active"
              : ""
          }
          onClick={() => setPage("analysis")}
        >
          📊 Analysis
        </li>


      </ul>

    </aside>

  );
}

export default Sidebar;