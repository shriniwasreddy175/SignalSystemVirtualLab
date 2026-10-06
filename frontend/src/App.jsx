import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import SignalGenerator from "./pages/SignalGenerator";
import SignalOperations from "./pages/SignalOperations";
import Analysis from "./pages/Analysis";

function App() {

  const [page, setPage] =
    useState("home");
  const [menuOpen, setMenuOpen] = useState(false);


  return (

    <div className="app">

      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <div className="main-layout">

        <Sidebar
          page={page}
          setPage={setPage}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        <main className="content">

          {page === "home" && (
            <Home />
          )}

          {page === "generator" && (
            <SignalGenerator />
          )}

          {page === "operations" && (
            <SignalOperations />
          )}

          {page === "analysis" && (
            <Analysis />
          )}

        </main>

      </div>

    </div>

  );

}

export default App;