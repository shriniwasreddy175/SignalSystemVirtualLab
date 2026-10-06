function OperationControls({
  operation,
  setOperation,
  parameter,
  setParameter
}) {

  return (

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

          <option value="addition">
            Addition
          </option>

          <option value="subtraction">
            Subtraction
          </option>

          <option value="multiplication">
            Multiplication
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

        </select>

      </div>


      {/* Parameter */}

      <div className="control-group">

        <label>

          Parameter:
          <strong> {parameter}</strong>

        </label>

        <input
          type="range"
          min="-3"
          max="3"
          step="0.1"
          value={parameter}
          onChange={(e) =>
            setParameter(
              Number(e.target.value)
            )
          }
        />

      </div>

    </div>

  );
}

export default OperationControls;