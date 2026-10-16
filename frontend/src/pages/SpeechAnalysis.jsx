import { useEffect, useRef, useState } from "react";
import "./SpeechAnalysis.css";

const FFT_SIZE = 2048;

function Metric({ label, value, note }) {
  return <article className="speech-metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function WaveChart({ title, values, color, sampleRate }) {
  const W=800,H=230,L=54,R=16,T=16,B=38, pw=W-L-R,ph=H-T-B;
  const max=Math.max(0.08,...values.map(v=>Math.abs(v)))*1.08;
  const points=values.map((v,i)=>`${L+i/Math.max(1,values.length-1)*pw},${T+(max-v)/(2*max)*ph}`).join(" ");
  return <section className="speech-chart">
    <div className="speech-chart-title"><h3>{title}</h3><span>{values.length ? "Live window" : "Waiting for microphone"}</span></div>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {[0,1,2,3,4].map(i=><g key={i}><line x1={L} y1={T+i*ph/4} x2={W-R} y2={T+i*ph/4} className="speech-grid"/><text x={L-8} y={T+i*ph/4+4} textAnchor="end" className="speech-tick">{(max-i*max/2).toFixed(2)}</text></g>)}
      {[0,1,2,3,4].map(i=><g key={i}><line x1={L+i*pw/4} y1={T} x2={L+i*pw/4} y2={H-B} className="speech-grid"/><text x={L+i*pw/4} y={H-B+17} textAnchor="middle" className="speech-tick">{(i*values.length/4/Math.max(sampleRate,1)).toFixed(3)}</text></g>)}
      <line x1={L} y1={T+ph/2} x2={W-R} y2={T+ph/2} className="speech-zero"/>
      <line x1={L} y1={H-B} x2={W-R} y2={H-B} className="speech-axis"/><line x1={L} y1={T} x2={L} y2={H-B} className="speech-axis"/>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5"/>
      <text x={W/2} y={H-6} textAnchor="middle" className="speech-axis-label">Time within window (s)</text>
    </svg>
  </section>;
}

function SpectrumChart({ title, bins, sampleRate, color }) {
  const W=800,H=230,L=54,R=16,T=16,B=38,pw=W-L-R,ph=H-T-B;
  const maxHz=Math.min(10000,sampleRate/2);
  const visible=bins.filter(b=>b.hz<=maxHz);
  const max=Math.max(-90,...visible.map(b=>b.db));
  const min=Math.min(-90,max-1);
  const points=visible.map(b=>`${L+b.hz/maxHz*pw},${T+(max-b.db)/(max-min)*ph}`).join(" ");
  return <section className="speech-chart">
    <div className="speech-chart-title"><h3>{title}</h3><span>FFT spectrum</span></div>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      {[0,1,2,3,4].map(i=><line key={i} x1={L} y1={T+i*ph/4} x2={W-R} y2={T+i*ph/4} className="speech-grid"/>)}
      {[0,2000,4000,6000,8000,10000].filter(f=>f<=maxHz).map(f=><g key={f}><line x1={L+f/maxHz*pw} y1={T} x2={L+f/maxHz*pw} y2={H-B} className="speech-grid"/><text x={L+f/maxHz*pw} y={H-B+17} textAnchor="middle" className="speech-tick">{f}</text></g>)}
      <line x1={L} y1={H-B} x2={W-R} y2={H-B} className="speech-axis"/><line x1={L} y1={T} x2={L} y2={H-B} className="speech-axis"/>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5"/>
      <text x={W/2} y={H-6} textAnchor="middle" className="speech-axis-label">Frequency (Hz)</text>
    </svg>
  </section>;
}

export default function SpeechAnalysis() {
  const [status,setStatus]=useState("idle"), [error,setError]=useState("");
  const [sampleRate,setSampleRate]=useState(48000), [cutoff,setCutoff]=useState(1800);
  const [raw,setRaw]=useState([]), [filtered,setFiltered]=useState([]);
  const [rawBins,setRawBins]=useState([]), [filteredBins,setFilteredBins]=useState([]);
  const [elapsed,setElapsed]=useState(0);
  const contextRef=useRef(null), streamRef=useRef(null), rafRef=useRef(null), startedRef=useRef(0);
  const rawRef=useRef(null), filterRef=useRef(null), filteredRef=useRef(null);

  useEffect(()=>{ if(filterRef.current && contextRef.current) filterRef.current.frequency.setTargetAtTime(cutoff,contextRef.current.currentTime,0.03); },[cutoff]);
  useEffect(()=>()=>cleanup(),[]);

  function cleanup() {
    if(rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current=null;
    streamRef.current?.getTracks().forEach(t=>t.stop());
    if(contextRef.current && contextRef.current.state!=="closed") contextRef.current.close().catch(()=>{});
    streamRef.current=null; contextRef.current=null; rawRef.current=null; filterRef.current=null; filteredRef.current=null;
  }
  function stop() { cleanup(); setStatus("stopped"); }

  async function start() {
    setError("");
    if(!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone access requires a supported browser and a secure context, such as localhost or HTTPS."); return;
    }
    cleanup();
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
      const Ctx=window.AudioContext||window.webkitAudioContext;
      const ctx=new Ctx(); await ctx.resume();
      const source=ctx.createMediaStreamSource(stream);
      const rawAnalyser=ctx.createAnalyser(); rawAnalyser.fftSize=FFT_SIZE; rawAnalyser.smoothingTimeConstant=0;
      const filter=ctx.createBiquadFilter(); filter.type="lowpass"; filter.frequency.value=cutoff; filter.Q.value=0.707;
      const filteredAnalyser=ctx.createAnalyser(); filteredAnalyser.fftSize=FFT_SIZE; filteredAnalyser.smoothingTimeConstant=0;
      source.connect(rawAnalyser); source.connect(filter); filter.connect(filteredAnalyser);
      contextRef.current=ctx; streamRef.current=stream; rawRef.current=rawAnalyser; filterRef.current=filter; filteredRef.current=filteredAnalyser;
      setSampleRate(ctx.sampleRate); startedRef.current=performance.now(); setElapsed(0); setStatus("live");
      const r=new Float32Array(FFT_SIZE), f=new Float32Array(FFT_SIZE);
      const rd=new Float32Array(rawAnalyser.frequencyBinCount), fd=new Float32Array(filteredAnalyser.frequencyBinCount);
      const tick=()=>{
        if(!rawRef.current||!filteredRef.current) return;
        rawRef.current.getFloatTimeDomainData(r); filteredRef.current.getFloatTimeDomainData(f);
        rawRef.current.getFloatFrequencyData(rd); filteredRef.current.getFloatFrequencyData(fd);
        setRaw(Array.from(r)); setFiltered(Array.from(f));
        const hzPerBin=ctx.sampleRate/FFT_SIZE;
        setRawBins(Array.from(rd,(db,i)=>({hz:i*hzPerBin,db})));
        setFilteredBins(Array.from(fd,(db,i)=>({hz:i*hzPerBin,db})));
        setElapsed((performance.now()-startedRef.current)/1000);
        rafRef.current=requestAnimationFrame(tick);
      };
      tick();
    } catch(e) {
      setError(e?.name==="NotAllowedError" ? "Microphone permission was denied. Allow microphone access in your browser's site settings and try again." : `Could not start capture: ${e?.message||"Unknown error"}`);
      cleanup(); setStatus("idle");
    }
  }

  const calc = vals => ({
    rms: vals.length ? Math.sqrt(vals.reduce((s,v)=>s+v*v,0)/vals.length) : 0,
    peak: vals.length ? Math.max(...vals.map(Math.abs)) : 0
  });
  const rm=calc(raw), fm=calc(filtered);
  const fcFromR = 1/(2*Math.PI*10000*1e-6);
  const peakHz = bins => {
    if(!bins.length) return "—";
    const usable=bins.filter(b=>b.hz>0 && b.hz<Math.min(10000,sampleRate/2));
    const best=usable.reduce((a,b)=>b.db>a.db?b:a,usable[0]);
    return best ? `${Math.round(best.hz)} Hz` : "—";
  };

  return <main className="speech-page">
    <header className="speech-hero">
      <div><p className="speech-eyebrow">SIGNALS & SYSTEMS · FA2</p><h1>Real-Time Speech Signal Analysis</h1>
        <p>Capture live speech, inspect its Fourier spectrum, and compare it with an RC low-pass filter modeled using the Laplace Transform.</p></div>
      <span className={`speech-status speech-status-${status}`}><i/>{status==="live"?"Microphone live":status==="stopped"?"Capture stopped":"Ready to capture"}</span>
    </header>
    <div className="speech-notice"><b>Privacy:</b> audio is processed locally in your browser. This module does not upload or save a voice recording. Microphone permission is required.</div>
    {error && <div className="speech-error" role="alert">{error}</div>}

    <div className="speech-top-grid">
      <section className="speech-panel">
        <div className="speech-heading"><span>01</span><div><h2>Live signal acquisition</h2><p>Start capture, then speak naturally for a few seconds.</p></div></div>
        <div className="speech-buttons"><button className="speech-primary" onClick={start} disabled={status==="live"}>Start microphone</button><button className="speech-secondary" onClick={stop} disabled={status!=="live"}>Stop capture</button></div>
        <div className="speech-info"><div><small>Browser sampling rate</small><b>{sampleRate.toLocaleString()} Hz</b></div><div><small>FFT window</small><b>{FFT_SIZE} samples</b></div><div><small>Elapsed time</small><b>{elapsed.toFixed(1)} s</b></div></div>
        <p className="speech-small">Charts show the latest analysis window, not a saved full-length recording. The browser and microphone determine the actual sample rate.</p>
      </section>
      <section className="speech-panel">
        <div className="speech-heading"><span>02</span><div><h2>Laplace-domain filter model</h2><p>Explore the RC low-pass cutoff.</p></div></div>
        <label className="speech-slider"><span><b>Cutoff frequency</b><output>{cutoff.toLocaleString()} Hz</output></span><input type="range" min="200" max="8000" step="100" value={cutoff} onChange={e=>setCutoff(Number(e.target.value))}/></label>
        <div className="speech-equation"><b>H(s) = 1 / (1 + RCs)</b><span>For R = 10 kΩ and C = 1 µF, theoretical f<sub>c</sub> ≈ {fcFromR.toFixed(2)} Hz.</span><small>The browser's digital low-pass filter is a practical comparison, not an exact analog circuit.</small></div>
      </section>
    </div>

    <div className="speech-metrics">
      <Metric label="Raw RMS" value={raw.length?rm.rms.toFixed(4):"—"} note="Original signal level"/>
      <Metric label="Filtered RMS" value={filtered.length?fm.rms.toFixed(4):"—"} note="After low-pass filtering"/>
      <Metric label="Raw peak bin" value={peakHz(rawBins)} note="Strongest non-DC bin"/>
      <Metric label="Filtered peak bin" value={peakHz(filteredBins)} note="Strongest non-DC bin"/>
    </div>

    <div className="speech-charts">
      <WaveChart title="Raw speech waveform" values={raw} color="#0f766e" sampleRate={sampleRate}/>
      <WaveChart title="Filtered speech waveform" values={filtered} color="#2563eb" sampleRate={sampleRate}/>
      <SpectrumChart title="Raw speech FFT spectrum" bins={rawBins} sampleRate={sampleRate} color="#7c3aed"/>
      <SpectrumChart title="Filtered speech FFT spectrum" bins={filteredBins} sampleRate={sampleRate} color="#c2410c"/>
    </div>

    <section className="speech-panel speech-explain">
      <div className="speech-heading"><span>03</span><div><h2>Analysis and interpretation</h2><p>Use your live measurements and screenshots for the report.</p></div></div>
      <div className="speech-explain-grid">
        <div><h3>Fourier Transform</h3><p>The FFT estimates the frequency content of the sampled speech window. Speech is time-varying and broadband, so its spectrum depends on the phrase and the selected window.</p></div>
        <div><h3>Laplace Transform</h3><p>The transfer function H(s) = 1/(1 + RCs) models a first-order low-pass system. Its pole is at s = −1/RC, and its cutoff frequency predicts high-frequency attenuation.</p></div>
        <div><h3>Result comparison</h3><p>Compare high-frequency components before and after filtering. A lower cutoff may reduce high-frequency noise but can also remove speech detail and make the voice sound muffled.</p></div>
      </div>
      <div className="speech-warning">For your final report, record actual observations. Microphone position, room noise, browser settings and spoken content can change the results.</div>
    </section>

    <section className="speech-panel speech-record">
      <div className="speech-heading"><span>04</span><div><h2>Observation plan</h2><p>Fill in actual findings during the demonstration.</p></div></div>
      <div className="speech-table-wrap"><table><thead><tr><th>Trial</th><th>Condition</th><th>Cutoff</th><th>Observation to record</th></tr></thead><tbody>
        <tr><td>1</td><td>Speech in a quiet room</td><td>Higher</td><td>Baseline waveform and spectrum</td></tr>
        <tr><td>2</td><td>Same phrase and position</td><td>Lower</td><td>Changes after filtering</td></tr>
        <tr><td>3</td><td>Speech with background noise</td><td>Higher</td><td>Noise-related spectral changes</td></tr>
        <tr><td>4</td><td>Same noisy condition</td><td>Lower</td><td>Noise suppression vs. speech detail</td></tr>
      </tbody></table></div>
    </section>
  </main>;
}
