import { useState } from "react";

import AnalysisGraph
  from "../components/AnalysisGraph";

import AnalysisControls
  from "../components/AnalysisControls";


function Analysis() {

  const [signalType, setSignalType] =
    useState("sine");

  const [amplitude, setAmplitude] =
    useState(1);

  const [frequency, setFrequency] =
    useState(1);

  const [phase, setPhase] =
    useState(0);

  const [analysisType, setAnalysisType] =
    useState("energy");


  /*
   * Generate signal samples
   */

  function generateSamples() {

    const dt = 0.01;

    const samples = [];

    for (
      let t = -5;
      t <= 5;
      t += dt
    ) {

      const angle =
        2 * Math.PI * frequency * t +
        phase * Math.PI / 180;

      let value = 0;

      switch (signalType) {

        case "sine":

          value =
            amplitude *
            Math.sin(angle);

          break;


        case "square":

          value =
            amplitude *
            (Math.sin(angle) >= 0
              ? 1
              : -1);

          break;


        case "triangle":

          value =
            amplitude *
            (2 / Math.PI) *
            Math.asin(
              Math.sin(angle)
            );

          break;


        case "ramp":

          value =
            amplitude *
            (((t % 1) + 1) % 1);

          break;


        case "exponential":

          value =
            t >= 0
              ? amplitude *
                Math.exp(
                  -frequency * t
                )
              : 0;

          break;


        case "unitstep":

          value =
            t >= 0
              ? amplitude
              : 0;

          break;


        case "impulse":

          value =
            Math.abs(t) < 0.05
              ? amplitude
              : 0;

          break;


        default:

          value = 0;

      }

      samples.push(value);

    }

    return {
      samples,
      dt
    };

  }


  /*
   * Calculate Energy
   *
   * E = integral |x(t)|² dt
   */

  function calculateEnergy() {

    const {
      samples,
      dt
    } = generateSamples();

    let energy = 0;

    for (const value of samples) {

      energy +=
        value * value * dt;

    }

    return energy;

  }


  /*
   * Calculate Power
   *
   * P = 1/T integral |x(t)|² dt
   */

  function calculatePower() {

    const {
      samples,
      dt
    } = generateSamples();

    let total = 0;

    for (const value of samples) {

      total +=
        value * value * dt;

    }

    const duration =
      samples.length * dt;

    return total / duration;

  }


  const energy =
    calculateEnergy();

  const power =
    calculatePower();


  let resultTitle = "";

  let resultValue = 0;

  let resultUnit = "";


  if (analysisType === "energy") {

    resultTitle = "Signal Energy";

    resultValue = energy;

    resultUnit = "J";

  }

  else if (analysisType === "power") {

    resultTitle = "Average Power";

    resultValue = power;

    resultUnit = "W";

  }

  else {

    resultTitle =
      "Frequency Spectrum";

    resultValue = frequency;

    resultUnit = "Hz";

  }


  return (

    <div className="analysis-page">

      <h1>
        Signal Analysis
      </h1>

      <p className="page-description">

        Analyze the energy, power and frequency
        characteristics of a continuous-time signal.

      </p>


      {/* Controls */}

      <AnalysisControls

        signalType={signalType}

        setSignalType={setSignalType}

        amplitude={amplitude}
        setAmplitude={setAmplitude}

        frequency={frequency}
        setFrequency={setFrequency}

        phase={phase}
        setPhase={setPhase}

        analysisType={analysisType}
        setAnalysisType={setAnalysisType}

      />


      {/* Signal */}

      <div className="analysis-panel">

        <div className="analysis-panel-header">

          <h2>
            Input Signal
          </h2>

          <span>
            {signalType}
          </span>

        </div>

        <AnalysisGraph

          signalType={signalType}

          amplitude={amplitude}

          frequency={frequency}

          phase={phase}

        />

      </div>


      {/* Result */}

      <div className="analysis-result">

        <div>

          <span>
            {resultTitle}
          </span>

          <strong>

            {resultValue.toFixed(4)}

          </strong>

          <small>
            {resultUnit}
          </small>

        </div>


        <div>

          <span>
            Amplitude
          </span>

          <strong>
            {amplitude}
          </strong>

        </div>


        <div>

          <span>
            Frequency
          </span>

          <strong>
            {frequency} Hz
          </strong>

        </div>


        <div>

          <span>
            Phase
          </span>

          <strong>
            {phase}°
          </strong>

        </div>

      </div>


      {/* Formula */}

      <div className="analysis-formula">

        <h2>
          Formula
        </h2>

        {analysisType === "energy" && (

          <p>
            E = ∫ |x(t)|² dt
          </p>

        )}

        {analysisType === "power" && (

          <p>
            P = (1/T) ∫ |x(t)|² dt
          </p>

        )}

        {analysisType === "spectrum" && (

          <p>
            X(f) = ∫ x(t)e<sup>−j2πft</sup> dt
          </p>

        )}

      </div>

    </div>

  );

}

export default Analysis;