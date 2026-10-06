import { useState } from "react";

import SignalGraph from "../components/SignalGraph";
import SignalControls from "../components/SignalControls";

function SignalGenerator() {

  const [signalType, setSignalType] =
    useState("sine");

  const [amplitude, setAmplitude] =
    useState(1);

  const [frequency, setFrequency] =
    useState(1);

  const [phase, setPhase] =
    useState(0);


  return (

    <div className="generator">

      <h1>Real-Time Signal Generator</h1>

      <p className="page-description">

        Generate and observe continuous-time signals
        by changing amplitude, frequency and phase.

      </p>


      {/* Controls */}

      <SignalControls

        signalType={signalType}

        setSignalType={setSignalType}

        amplitude={amplitude}

        setAmplitude={setAmplitude}

        frequency={frequency}

        setFrequency={setFrequency}

        phase={phase}

        setPhase={setPhase}

      />


      {/* Graph */}

      <div className="graph-card">

        <SignalGraph

          signalType={signalType}

          amplitude={amplitude}

          frequency={frequency}

          phase={phase}

        />

      </div>


      {/* Current values */}

      <div className="signal-info">

        <div>
          <span>Signal</span>
          <strong>
            {signalType}
          </strong>
        </div>

        <div>
          <span>Amplitude</span>
          <strong>
            {amplitude}
          </strong>
        </div>

        <div>
          <span>Frequency</span>
          <strong>
            {frequency} Hz
          </strong>
        </div>

        <div>
          <span>Phase</span>
          <strong>
            {phase}°
          </strong>
        </div>

      </div>

    </div>

  );
}

export default SignalGenerator;