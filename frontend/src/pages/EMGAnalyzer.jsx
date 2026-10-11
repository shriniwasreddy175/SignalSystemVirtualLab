import { useMemo, useState } from "react";
import "./EMGAnalyzer.css";

const N = 500;
const FS = 1000;
const DURATION = N / FS;

function noiseAt(i, seed = 0) {
  let x = Math.imul(i + 1 + seed * 7919, 374761393);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return (((x ^ (x >>> 16)) >>> 0) / 4294967295) * 2 - 1;
}

function makeSignal(amplitude, noise, activation, seed = 0) {
  return Array.from({ length: N }, (_, i) => {
    const t = i / FS;
    const envelope = 0.18 + activation * (0.22 + 0.78 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * 2.2 * t)), 1.4));
    const muscle = 0.55 * Math.sin(2 * Math.PI * 73 * t)
      + 0.30 * Math.sin(2 * Math.PI * 119 * t + 0.7)
      + 0.15 * Math.sin(2 * Math.PI * 167 * t + 1.2);
    return { t, value: amplitude * envelope * muscle + noise * 0.65 * noiseAt(i, seed) };
  });
}

function metrics(samples) {
  const v = samples.map(p => p.value);
  const sumSq = v.reduce((s, x) => s + x * x, 0);
  return {
    rms: Math.sqrt(sumSq / v.length),
    energy: sumSq,
    mav: v.reduce((s, x) => s + Math.abs(x), 0) / v.length,
    peak: Math.max(...v.map(Math.abs)),
    mean: v.reduce((s, x) => s + x, 0) / v.length,
  };
}

function dft(samples) {
  const size = 128;
  const vals = samples.slice(0, size).map(p => p.value);
  return Array.from({ length: size / 2 + 1 }, (_, k) => {
    let re = 0, im = 0;
    for (let n = 0; n < size; n++) {
      const a = 2 * Math.PI * k * n / size;
      re += vals[n] * Math.cos(a);
      im -= vals[n] * Math.sin(a);
    }
    return { f: k * FS / size, m: Math.hypot(re, im) / size };
  });
}

function WaveChart({ data, title, color = "#0f766e" }) {
  const W = 900, H = 290, L = 65, R = 20, T = 20, B = 42;
  const pw = W - L - R, ph = H - T - B;
  const max = Math.max(0.25, ...data.map(p => Math.abs(p.value))) * 1.1;
  const px = i => L + i / (data.length - 1) * pw;
  const py = v => T + (max - v) / (2 * max) * ph;
  const points = data.map((p, i) => `${px(i)},${py(p.value)}`).join(" ");
  return <section className="emg-chart">
    <div className="emg-chart-head"><h3>{title}</h3><span>{data.length} samples</span></div>
    <div className="emg-svg-wrap"><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {[0,1,2,3,4].map(i => {
        const gy = T + ph * i / 4;
        return <g key={i}>
          <line x1={L} y1={gy} x2={W-R} y2={gy} className="emg-grid"/>
          <text x={L-9} y={gy+4} textAnchor="end" className="emg-tick">{(max-max*i/2).toFixed(2)}</text>
        </g>;
      })}
      {[0,1,2,3,4].map(i => {
        const gx = L + pw * i / 4;
        return <g key={i}>
          <line x1={gx} y1={T} x2={gx} y2={H-B} className="emg-grid"/>
          <text x={gx} y={H-B+19} textAnchor="middle" className="emg-tick">{(DURATION*i/4).toFixed(2)}</text>
        </g>;
      })}
      <line x1={L} y1={py(0)} x2={W-R} y2={py(0)} className="emg-zero"/>
      <line x1={L} y1={T} x2={L} y2={H-B} className="emg-axis"/>
      <line x1={L} y1={H-B} x2={W-R} y2={H-B} className="emg-axis"/>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/>
      <text x={W/2} y={H-7} textAnchor="middle" className="emg-label">Time (seconds)</text>
      <text transform={`translate(16 ${H/2}) rotate(-90)`} textAnchor="middle" className="emg-label">Amplitude (a.u.)</text>
    </svg></div>
  </section>;
}

function SpectrumChart({ data }) {
  const W = 900, H = 260, L = 65, R = 20, T = 18, B = 42;
  const pw = W-L-R, ph = H-T-B, maxF = 500;
  const shown = data.filter(p => p.f <= maxF);
  const maxM = Math.max(0.001, ...shown.map(p => p.m)) * 1.1;
  const points = shown.map(p => `${L+p.f/maxF*pw},${T+(1-p.m/maxM)*ph}`).join(" ");
  return <section className="emg-chart">
    <div className="emg-chart-head"><h3>Frequency-domain view</h3><span>Magnitude spectrum · DFT estimate</span></div>
    <div className="emg-svg-wrap"><svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="EMG frequency spectrum">
      {[0,1,2,3,4].map(i => <line key={i} x1={L} y1={T+ph*i/4} x2={W-R} y2={T+ph*i/4} className="emg-grid"/>)}
      {[0,100,200,300,400,500].map(f => {
        const x = L + f/maxF*pw;
        return <g key={f}><line x1={x} y1={T} x2={x} y2={H-B} className="emg-grid"/>
          <text x={x} y={H-B+19} textAnchor="middle" className="emg-tick">{f}</text></g>;
      })}
      <line x1={L} y1={T} x2={L} y2={H-B} className="emg-axis"/>
      <line x1={L} y1={H-B} x2={W-R} y2={H-B} className="emg-axis"/>
      <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="1.8"/>
      <text x={W/2} y={H-7} textAnchor="middle" className="emg-label">Frequency (Hz)</text>
      <text transform={`translate(16 ${H/2}) rotate(-90)`} textAnchor="middle" className="emg-label">Magnitude (a.u.)</text>
    </svg></div>
  </section>;
}

export default function EMGAnalyzer() {
  const [amplitude, setAmplitude] = useState(1);
  const [noise, setNoise] = useState(0.15);
  const [activation, setActivation] = useState(0.8);
  const [comparison, setComparison] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const signal = useMemo(() => makeSignal(amplitude, noise, activation, refresh), [amplitude, noise, activation, refresh]);
  const clean = useMemo(() => makeSignal(amplitude, 0, activation, refresh), [amplitude, activation, refresh]);
  const m = useMemo(() => metrics(signal), [signal]);
  const spectrum = useMemo(() => dft(signal), [signal]);
  const noiseLevel = noise < 0.2 ? "Low" : noise < 0.55 ? "Moderate" : "High";
  const conclusion = noise >= 0.55
    ? "The high-noise setting adds visible interference. Compare with the noise-disabled reference before interpreting the waveform."
    : amplitude >= 1.4
      ? "The higher amplitude setting increases waveform magnitude and generally increases RMS and energy."
      : "The waveform shows simulated muscle-activity variation. Changing amplitude and noise helps demonstrate their effects on signal interpretation.";

  function reset() {
    setAmplitude(1); setNoise(0.15); setActivation(0.8); setComparison(true); setRefresh(x => x+1);
  }

  return <main className="emg-page">
    <header className="emg-hero">
      <div><p className="emg-eyebrow">SIGNALS & SYSTEMS · PRACTICAL 08</p>
        <h1>EMG Signal Analyzer</h1>
        <p className="emg-subtitle">Explore a simulated surface electromyogram with time-domain and frequency-domain analysis.</p></div>
      <span className="emg-badge"><i/> Simulation mode</span>
    </header>

    <div className="emg-notice"><b>Educational simulation:</b> this is a generated EMG-like signal, not a live recording from a person or a medical diagnostic tool.</div>

    <div className="emg-layout">
      <aside className="emg-panel emg-controls">
        <div className="emg-section-head"><div><span className="emg-step">01</span><h2>Signal controls</h2></div><button className="emg-reset" onClick={reset} type="button">Reset</button></div>

        <label className="emg-control"><span><b>Signal amplitude</b><output>{amplitude.toFixed(1)} a.u.</output></span>
          <input type="range" min="0.2" max="2" step="0.1" value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))}/>
          <small>Changes the overall waveform magnitude.</small></label>

        <label className="emg-control"><span><b>Noise amplitude</b><output>{noise.toFixed(2)}</output></span>
          <input type="range" min="0" max="0.8" step="0.05" value={noise} onChange={e=>setNoise(Number(e.target.value))}/>
          <small>Adds simulated background interference.</small></label>

        <label className="emg-control"><span><b>Muscle activation</b><output>{Math.round(activation*100)}%</output></span>
          <input type="range" min="0.1" max="1" step="0.1" value={activation} onChange={e=>setActivation(Number(e.target.value))}/>
          <small>Changes the strength of the activity envelope.</small></label>

        <label className="emg-toggle"><input type="checkbox" checked={comparison} onChange={e=>setComparison(e.target.checked)}/> Show clean-signal comparison</label>
        <button className="emg-primary" type="button" onClick={()=>setRefresh(x=>x+1)}>Regenerate signal <span>↻</span></button>
        <p className="emg-footnote">Sampling rate: {FS} Hz · Duration: {DURATION.toFixed(2)} s · {N} samples</p>
      </aside>

      <section className="emg-results">
        <div className="emg-metrics">
          <article><span>RMS amplitude</span><strong>{m.rms.toFixed(4)}</strong><small>Root mean square</small></article>
          <article><span>Mean absolute value</span><strong>{m.mav.toFixed(4)}</strong><small>Average rectified level</small></article>
          <article><span>Peak magnitude</span><strong>{m.peak.toFixed(4)}</strong><small>Maximum absolute sample</small></article>
          <article><span>Signal energy</span><strong>{m.energy.toFixed(2)}</strong><small>Sum of squared samples</small></article>
        </div>

        <WaveChart data={signal} title="Simulated EMG — current settings"/>
        {comparison && <WaveChart data={clean} title="Reference waveform — noise disabled" color="#2563eb"/>}
        <SpectrumChart data={spectrum}/>

        <section className="emg-panel emg-analysis">
          <div className="emg-section-head"><div><span className="emg-step">02</span><h2>Analysis & interpretation</h2></div></div>
          <div className="emg-observations">
            <div><span>Noise setting</span><b>{noiseLevel}</b></div>
            <div><span>Mean value</span><b>{m.mean.toFixed(4)} a.u.</b></div>
            <div><span>Activation setting</span><b>{Math.round(activation*100)}%</b></div>
          </div>
          <p>{conclusion}</p>
          <ul>
            <li><b>Time domain:</b> examine waveform magnitude and variation over time.</li>
            <li><b>Noise effect:</b> compare the signal with the noise-disabled reference.</li>
            <li><b>Frequency domain:</b> the spectrum is a basic DFT estimate of magnitude versus frequency.</li>
            <li><b>Measurements:</b> RMS and mean absolute value summarise magnitude; energy is the sum of squared samples.</li>
          </ul>
        </section>
      </section>
    </div>

    <section className="emg-panel emg-record">
      <div className="emg-section-head"><div><span className="emg-step">03</span><h2>Practical 8 observation guide</h2></div></div>
      <p>Change one control at a time and record the actual settings and measurements shown by the simulator.</p>
      <div className="emg-table-wrap"><table><thead><tr><th>Trial</th><th>Amplitude</th><th>Noise</th><th>What to observe</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Low</td><td>Low</td><td>Baseline waveform and measurements</td></tr>
          <tr><td>2</td><td>High</td><td>Low</td><td>Change in waveform magnitude, RMS and energy</td></tr>
          <tr><td>3</td><td>Low</td><td>High</td><td>Effect of interference on the waveform</td></tr>
          <tr><td>4</td><td>High</td><td>High</td><td>Combined effect of signal strength and noise</td></tr>
        </tbody></table></div>
      <p className="emg-footnote">Values are in arbitrary units (a.u.). This simulator is for educational signal analysis only.</p>
    </section>
  </main>;
}
