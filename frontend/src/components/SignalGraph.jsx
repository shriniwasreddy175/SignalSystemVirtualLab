import { useEffect, useRef } from "react";

function SignalGraph({
  signalType,
  amplitude,
  frequency,
  phase,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    // -----------------------------
    // Graph area
    // -----------------------------

    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 45;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    const centerY = paddingTop + graphHeight / 2;

    // X range
    const xMin = -5;
    const xMax = 5;

    // Y range
    const yMin = -Math.max(2, amplitude * 1.5);
    const yMax = Math.max(2, amplitude * 1.5);

    // Coordinate conversion
    const xToCanvas = (x) =>
      paddingLeft + ((x - xMin) / (xMax - xMin)) * graphWidth;

    const yToCanvas = (y) =>
      paddingTop +
      ((yMax - y) / (yMax - yMin)) * graphHeight;

    // -----------------------------
    // Clear canvas
    // -----------------------------

    ctx.clearRect(0, 0, width, height);

    // -----------------------------
    // Background
    // -----------------------------

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // -----------------------------
    // Grid
    // -----------------------------

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = xMin; x <= xMax; x += 1) {
      const px = xToCanvas(x);

      ctx.beginPath();
      ctx.moveTo(px, paddingTop);
      ctx.lineTo(px, paddingTop + graphHeight);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += 1) {
      const py = yToCanvas(y);

      ctx.beginPath();
      ctx.moveTo(paddingLeft, py);
      ctx.lineTo(paddingLeft + graphWidth, py);
      ctx.stroke();
    }

    // -----------------------------
    // Axes
    // -----------------------------

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;

    // X axis
    const xAxisY = yToCanvas(0);

    ctx.beginPath();
    ctx.moveTo(paddingLeft, xAxisY);
    ctx.lineTo(paddingLeft + graphWidth, xAxisY);
    ctx.stroke();

    // Y axis
    const yAxisX = xToCanvas(0);

    ctx.beginPath();
    ctx.moveTo(yAxisX, paddingTop);
    ctx.lineTo(yAxisX, paddingTop + graphHeight);
    ctx.stroke();

    // -----------------------------
    // X-axis readings
    // -----------------------------

    ctx.fillStyle = "#374151";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let x = xMin; x <= xMax; x += 1) {
      if (x === 0) continue;

      const px = xToCanvas(x);

      ctx.fillText(
        x.toString(),
        px,
        xAxisY + 8
      );

      // Tick
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(px, xAxisY - 4);
      ctx.lineTo(px, xAxisY + 4);
      ctx.stroke();
    }

    // -----------------------------
    // Y-axis readings
    // -----------------------------

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const yStep = 1;

    for (
      let y = Math.ceil(yMin);
      y <= Math.floor(yMax);
      y += yStep
    ) {
      if (y === 0) continue;

      const py = yToCanvas(y);

      ctx.fillText(
        y.toString(),
        yAxisX - 8,
        py
      );

      // Tick
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(yAxisX - 4, py);
      ctx.lineTo(yAxisX + 4, py);
      ctx.stroke();
    }

    // Origin
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.fillText(
      "0",
      yAxisX - 8,
      xAxisY + 8
    );

    // -----------------------------
    // Axis labels
    // -----------------------------

    ctx.fillStyle = "#111827";
    ctx.font = "bold 13px Arial";

    // X label
    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.fillText(
      "t",
      paddingLeft + graphWidth,
      xAxisY + 25
    );

    // Y label
    ctx.save();

    ctx.translate(
      yAxisX - 35,
      paddingTop
    );

    ctx.rotate(-Math.PI / 2);

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText("x(t)", 0, 0);

    ctx.restore();

    // -----------------------------
    // Signal function
    // -----------------------------

    const getSignalValue = (t) => {
      const angle =
        2 * Math.PI * frequency * t +
        (phase * Math.PI) / 180;

      switch (signalType) {
        case "sine":
          return amplitude * Math.sin(angle);

        case "square":
          return amplitude *
            (Math.sin(angle) >= 0 ? 1 : -1);

        case "triangle":
          return (
            amplitude *
            (2 / Math.PI) *
            Math.asin(Math.sin(angle))
          );

        case "ramp": {
          const cycle = ((frequency * t) % 1 + 1) % 1;
          return amplitude * (2 * cycle - 1);
        }

        case "exponential":
          return amplitude * Math.exp(-frequency * Math.max(t, 0));

        case "unitstep":
          return t >= 0 ? amplitude : 0;

        case "impulse":
          return Math.abs(t) < 0.03 ? amplitude : 0;

        default:
          return 0;
      }
    };

    // -----------------------------
    // Draw signal
    // -----------------------------

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const points = 1000;

    for (let i = 0; i <= points; i++) {
      const t =
        xMin +
        (i / points) * (xMax - xMin);

      const value = getSignalValue(t);

      const px = xToCanvas(t);
      const py = yToCanvas(value);

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();

    // -----------------------------
    // Draw impulse marker
    // -----------------------------

    if (signalType === "impulse") {
      const px = xToCanvas(0);
      const py = yToCanvas(amplitude);

      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(px, xAxisY);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.fillStyle = "#dc2626";

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [
    signalType,
    amplitude,
    frequency,
    phase,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "450px",
        display: "block",
      }}
    />
  );
}

export default SignalGraph;