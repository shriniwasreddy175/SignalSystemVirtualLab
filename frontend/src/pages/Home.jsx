function Home() {
  return (
    <div className="home">

      {/* Header */}
      <h1>Signals & Systems Virtual Lab</h1>

      <p className="welcome-text">
        Welcome to our interactive virtual laboratory designed to
        understand, generate, perform operations and analyze
        continuous-time signals.
      </p>

      {/* Project Information */}
      <div className="project-info">
        <h2>📡 About the Virtual Lab</h2>

        <p>
          This virtual laboratory is developed as an academic project
          by students of the Electronics and Telecommunication Engineering
          Department at Pimpri Chinchwad College of Engineering (PCCOE).
        </p>

        <p>
          The lab provides an interactive environment for visualizing
          signals and understanding important concepts of Signals &
          Systems through practical experimentation.
        </p>
      </div>

      {/* Main Modules */}
      <h2 className="section-title">Explore the Laboratory</h2>

      <div className="cards">

        <div className="card">
          <h2>📈 Signal Generator</h2>
          <p>
            Generate and observe different continuous-time signals
            by changing amplitude, frequency and phase.
          </p>
        </div>

        <div className="card">
          <h2>🔄 Signal Operations</h2>
          <p>
            Perform amplitude scaling, time shifting,
            time scaling, time reversal and signal operations.
          </p>
        </div>

        <div className="card">
          <h2>📊 Signal Analysis</h2>
          <p>
            Analyze signals and calculate important properties
            such as energy and power.
          </p>
        </div>

      </div>

      {/* Learning Objective */}
      <div className="learning-section">

        <h2>🎯 Learning Objective</h2>

        <p>
          The main objective of this virtual lab is to bridge the gap
          between theoretical concepts and practical implementation.
          Students can visualize signal behavior and observe how
          different operations affect a signal.
        </p>

        <div className="topics">
          <span>Continuous-Time Signals</span>
          <span>Signal Generation</span>
          <span>Signal Operations</span>
          <span>Energy & Power</span>
          <span>Signal Visualization</span>
        </div>

      </div>

      {/* Team */}
      <div className="team-section">

        <h2>👨‍💻 Project Team</h2>

        <div className="team-list">

          <div className="team-member">
            <strong>126B2E030</strong>
            <span>Sarthak Ganesh Sonwane</span>
          </div>

          <div className="team-member">
            <strong>126B2E031</strong>
            <span>Mare Shrinivas Pralhad</span>
          </div>

          <div className="team-member">
            <strong>126B2E033</strong>
            <span>Khushal Hari Deore</span>
          </div>

        </div>

      </div>

      {/* College */}
      <div className="college-info">

        <h3>
          Pimpri Chinchwad College of Engineering (PCCOE)
        </h3>

        <p>
          Electronics & Telecommunication Engineering
        </p>

        <p className="project-tagline">
          Learn • Visualize • Experiment • Understand
        </p>

      </div>

    </div>
  );
}

export default Home;