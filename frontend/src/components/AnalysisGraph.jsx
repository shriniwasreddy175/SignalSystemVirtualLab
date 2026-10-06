import { useEffect, useRef } from "react";

function AnalysisGraph({
  signalType,
  amplitude,
  frequency,
  phase
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.scale(dpr, dpr);

    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 45;

    const graphWidth = width - paddingLeft - paddingRight;
    const graphHeight = height - paddingTop - paddingBottom;

    const xMin = -5;
    const xMax = 5;

    const yMin = -Math.max(2, amplitude * 1.5);
    const yMax = Math.max(2, amplitude * 1.5);

    const xToCanvas = (x) =>
      paddingLeft +
      ((x - xMin) / (xMax - xMin)) * graphWidth;

    const yToCanvas = (y) =>
      paddingTop +
      ((yMax - y) / (yMax - yMin)) * graphHeight;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // -----------------------------
    // Grid
    // -----------------------------

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    for (let x = xMin; x <= xMax; x++) {
      const px = xToCanvas(x);

      ctx.beginPath();
      ctx.moveTo(px, paddingTop);
      ctx.lineTo(px, paddingTop + graphHeight);
      ctx.stroke();
    }

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
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

    const xAxisY = yToCanvas(0);
    const yAxisX = xToCanvas(0);

    ctx.beginPath();
    ctx.moveTo(paddingLeft, xAxisY);
    ctx.lineTo(
      paddingLeft + graphWidth,
      xAxisY
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(yAxisX, paddingTop);
    ctx.lineTo(
      yAxisX,
      paddingTop + graphHeight
    );
    ctx.stroke();

    // -----------------------------
    // X-axis readings
    // -----------------------------

    ctx.fillStyle = "#374151";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let x = xMin; x <= xMax; x++) {
      if (x === 0) continue;

      const px = xToCanvas(x);

      ctx.fillText(
        x.toString(),
        px,
        xAxisY + 8
      );

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

    for (
      let y = Math.ceil(yMin);
      y <= Math.floor(yMax);
      y++
    ) {
      if (y === 0) continue;

      const py = yToCanvas(y);

      ctx.fillText(
        y.toString(),
        yAxisX - 8,
        py
      );

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

    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    ctx.fillText(
      "t",
      paddingLeft + graphWidth,
      xAxisY + 25
    );

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
    // Generate signal
    // -----------------------------

    function generateSignal(t) {
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
          return amplitude *
            (2 / Math.PI) *
            Math.asin(Math.sin(angle));

        case "ramp":
          return amplitude *
            (((t % 1) + 1) % 1);

        case "exponential":
          return t >= 0
            ? amplitude *
              Math.exp(-frequency * t)
            : 0;

        case "unitstep":
          return t >= 0
            ? amplitude
            : 0;

        case "impulse":
          return Math.abs(t) < 0.05
            ? amplitude
            : 0;

        default:
          return 0;
      }
    }

    // -----------------------------
    // Draw signal
    // -----------------------------

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;

    ctx.beginPath();

    const points = 1000;

    for (let i = 0; i < points; i++) {
      const x = i / (points - 1);

      const t = (x - 0.5) * 10;

      const y = generateSignal(t);

      const px = xToCanvas(t);
      const py = yToCanvas(y);

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();

    // -----------------------------
    // Impulse marker
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
    phase
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "450px",
        display: "block"
      }}
    />
  );
}

export default AnalysisGraph;