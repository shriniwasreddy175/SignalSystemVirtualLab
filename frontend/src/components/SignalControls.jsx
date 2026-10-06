function SignalControls({
  signalType,
  setSignalType,
  amplitude,
  setAmplitude,
  frequency,
  setFrequency,
  phase,
  setPhase
}) {

  return (
    <div className="controls">

      {/* Signal Type */}

      <div className="control-group">

        <label>Signal Type</label>

        <select
          value={signalType}
          onChange={(e) =>
            setSignalType(e.target.value)
          }
        >

          <option value="sine">
            Sinusoidal
          </option>

          <option value="square">
            Square
          </option>

          <option value="triangle">
            Triangular
          </option>

          <option value="ramp">
            Ramp
          </option>

          <option value="exponential">
            Exponential Decay
          </option>

          <option value="unitstep">
            Unit Step
          </option>

          <option value="impulse">
            Unit Impulse
          </option>

        </select>

      </div>


      {/* Amplitude */}

      <div className="control-group">

        <label>
          Amplitude:
          <strong> {amplitude}</strong>
        </label>

        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={amplitude}
          onChange={(e) =>
            setAmplitude(Number(e.target.value))
          }
        />

      </div>


      {/* Frequency */}

      <div className="control-group">

        <label>
          Frequency:
          <strong> {frequency} Hz</strong>
        </label>

        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={frequency}
          onChange={(e) =>
            setFrequency(Number(e.target.value))
          }
        />

      </div>


      {/* Phase */}

      <div className="control-group">

        <label>
          Phase:
          <strong> {phase}°</strong>
        </label>

        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={phase}
          onChange={(e) =>
            setPhase(Number(e.target.value))
          }
        />

      </div>

    </div>
  );
}

export default SignalControls;