import { useState } from "react";

import SignalOperationGraph
  from "../components/SignalOperationGraph";

import SignalSelector
  from "../components/SignalSelector";

import CombinedSignalGraph
  from "../components/CombinedSignalGraph";

function SignalOperations() {

  const [operation, setOperation] =
    useState("amplitude");

  // Signal 1
  const [signal1, setSignal1] =
    useState("sine");

  // Signal 2
  const [signal2, setSignal2] =
    useState("square");

  // Common parameters
  const [amplitude1, setAmplitude1] =
    useState(1);

  const [amplitude2, setAmplitude2] =
    useState(1);

  const [frequency1, setFrequency1] =
    useState(1);

  const [frequency2, setFrequency2] =
    useState(1);

  const [phase1, setPhase1] =
    useState(0);

  const [phase2, setPhase2] =
    useState(0);

  // Single signal operation parameter
  const [parameter, setParameter] =
    useState(2);


  const operationNames = {

    amplitude: "Amplitude Scaling",

    shift: "Time Shifting",

    scale: "Time Scaling",

    reverse: "Time Reversal",

    addition: "Addition",

    subtraction: "Subtraction",

    multiplication: "Multiplication"

  };


  const singleInput =
    ["amplitude", "shift", "scale", "reverse"]
      .includes(operation);


  const twoInput =
    ["addition", "subtraction", "multiplication"]
      .includes(operation);


  return (

    <div className="operations-page">

      <h1>
        Signal Operations
      </h1>

      <p className="page-description">

        Perform mathematical and time-domain
        operations on continuous-time signals.

      </p>


      {/* Operation Selection */}

      <div className="operation-controls">

        <div className="control-group">

          <label>
            Select Operation
          </label>

          <select
            value={operation}
            onChange={(e) =>
              setOperation(e.target.value)
            }
          >

            <option value="amplitude">
              Amplitude Scaling
            </option>

            <option value="shift">
              Time Shifting
            </option>

            <option value="scale">
              Time Scaling
            </option>

            <option value="reverse">
              Time Reversal
            </option>

            <option value="addition">
              Addition
            </option>

            <option value="subtraction">
              Subtraction
            </option>

            <option value="multiplication">
              Multiplication
            </option>

          </select>

        </div>


        {/* Parameter for single-input operations */}

        {singleInput &&
          operation !== "reverse" && (

          <div className="control-group">

            <label>
              Parameter:
              <strong> {parameter}</strong>
            </label>

            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={parameter}
              onChange={(e) =>
                setParameter(
                  Number(e.target.value)
                )
              }
            />

          </div>

        )}

      </div>


      {/* ========================= */}
      {/* SIGNAL 1 */}
      {/* ========================= */}

      <div className="signal-input-card">

        <h2>Signal 1</h2>

        <div className="signal-input-controls">

          <SignalSelector
            label="Signal Type"
            value={signal1}
            onChange={setSignal1}
          />


          <div className="control-group">

            <label>
              Amplitude: {amplitude1}
            </label>

            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={amplitude1}
              onChange={(e) =>
                setAmplitude1(
                  Number(e.target.value)
                )
              }
            />

          </div>


          <div className="control-group">

            <label>
              Frequency: {frequency1} Hz
            </label>

            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={frequency1}
              onChange={(e) =>
                setFrequency1(
                  Number(e.target.value)
                )
              }
            />

          </div>


          <div className="control-group">

            <label>
              Phase: {phase1}°
            </label>

            <input
              type="range"
              min="-180"
              max="180"
              value={phase1}
              onChange={(e) =>
                setPhase1(
                  Number(e.target.value)
                )
              }
            />

          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* SIGNAL 2 */}
      {/* ========================= */}

      {twoInput && (

        <div className="signal-input-card">

          <h2>Signal 2</h2>

          <div className="signal-input-controls">

            <SignalSelector
              label="Signal Type"
              value={signal2}
              onChange={setSignal2}
            />


            <div className="control-group">

              <label>
                Amplitude: {amplitude2}
              </label>

              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={amplitude2}
                onChange={(e) =>
                  setAmplitude2(
                    Number(e.target.value)
                  )
                }
              />

            </div>


            <div className="control-group">

              <label>
                Frequency: {frequency2} Hz
              </label>

              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={frequency2}
                onChange={(e) =>
                  setFrequency2(
                    Number(e.target.value)
                  )
                }
              />

            </div>


            <div className="control-group">

              <label>
                Phase: {phase2}°
              </label>

              <input
                type="range"
                min="-180"
                max="180"
                value={phase2}
                onChange={(e) =>
                  setPhase2(
                    Number(e.target.value)
                  )
                }
              />

            </div>

          </div>

        </div>

      )}


      {/* ========================= */}
      {/* FORMULA */}
      {/* ========================= */}

      <div className="formula-card">

        <h2>
          {operationNames[operation]}
        </h2>

        <p>

          {operation === "amplitude" &&
            "y(t) = A × x(t)"}

          {operation === "shift" &&
            "y(t) = x(t − t₀)"}

          {operation === "scale" &&
            "y(t) = x(at)"}

          {operation === "reverse" &&
            "y(t) = x(−t)"}

          {operation === "addition" &&
            "y(t) = x₁(t) + x₂(t)"}

          {operation === "subtraction" &&
            "y(t) = x₁(t) − x₂(t)"}

          {operation === "multiplication" &&
            "y(t) = x₁(t) × x₂(t)"}

        </p>

      </div>


      {/* ========================= */}
      {/* SINGLE INPUT */}
      {/* ========================= */}

      {singleInput && (

        <div className="operation-panels">

          {/* Input */}

          <div className="wave-panel">

            <div className="wave-panel-header">

              <h3>
                Input Signal x(t)
              </h3>

              <span>
                {signal1}
              </span>

            </div>

            <SignalOperationGraph

              signalType={signal1}

              amplitude={amplitude1}

              frequency={frequency1}

              phase={phase1}

            />

          </div>


          {/* Result */}

          <div className="wave-panel">

            <div className="wave-panel-header">

              <h3>
                Transformed Signal y(t)
              </h3>

              <span>
                {operationNames[operation]}
              </span>

            </div>

            <SignalOperationGraph

              signalType={signal1}

              amplitude={amplitude1}

              frequency={frequency1}

              phase={phase1}

              transform={operation}

              transformParameter={parameter}

            />

          </div>

        </div>

      )}


      {/* ========================= */}
      {/* TWO INPUT */}
      {/* ========================= */}

      {twoInput && (

        <div className="operation-panels three-panels">

          {/* Signal 1 */}

          <div className="wave-panel">

            <div className="wave-panel-header">

              <h3>
                Signal 1 — x₁(t)
              </h3>

              <span>
                {signal1}
              </span>

            </div>

            <SignalOperationGraph

              signalType={signal1}

              amplitude={amplitude1}

              frequency={frequency1}

              phase={phase1}

            />

          </div>


          {/* Signal 2 */}

          <div className="wave-panel">

            <div className="wave-panel-header">

              <h3>
                Signal 2 — x₂(t)
              </h3>

              <span>
                {signal2}
              </span>

            </div>

            <SignalOperationGraph

              signalType={signal2}

              amplitude={amplitude2}

              frequency={frequency2}

              phase={phase2}

            />

          </div>


          {/* Result */}

          <div className="wave-panel">

            <div className="wave-panel-header">

              <h3>
                Result — y(t)
              </h3>

              <span>
                {operationNames[operation]}
              </span>

            </div>

            <CombinedSignalGraph

              operation={operation}

              signal1={signal1}
              signal2={signal2}

              amplitude1={amplitude1}
              amplitude2={amplitude2}

              frequency1={frequency1}
              frequency2={frequency2}

              phase1={phase1}
              phase2={phase2}

            />

          </div>

        </div>

      )}

    </div>

  );

}

export default SignalOperations;