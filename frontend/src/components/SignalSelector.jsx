function SignalSelector({
  label,
  value,
  onChange
}) {
  return (
    <div className="control-group">

      <label>{label}</label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
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
  );
}

export default SignalSelector;