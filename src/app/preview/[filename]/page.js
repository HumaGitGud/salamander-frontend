// Preview page (display video information when clicked from videos list)

'use client';

import { useState, useEffect, useRef, use } from 'react';
import Image from 'next/image';

export default function PreviewPage({ params }) {
  const { filename } = use(params);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [resultFile, setResultFile] = useState(null);

  const [color, setColor] = useState('#000000'); // default black
  const [threshold, setThreshold] = useState(75); // default 75
  const [binarizeSettings, setBinarizeSettings] = useState(null); // { color, threshold } or null
  const originalImgRef = useRef(null);
  const canvasRef = useRef(null);

  // make a POST request with a given link
  const handleStartProcess = async () => {
    try {
      const hex = color.replace('#', '').toUpperCase(); // remove # for backend
      const res = await fetch(`http://localhost:3000/process/${filename}?targetColor=${hex}&threshold=${threshold}`,
        { method: 'POST' }
      );

      if (!res.ok) throw new Error("Failed to start processing");

      const data = await res.json();
      setJobId(data.jobId);
      setStatus('processing');
    } catch (err) {
      console.error("Error starting process:", err);
    }
  };

  // fetch and display job status using interval
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3000/process/${jobId}/status`);
        if (!res.ok) throw new Error("Failed to fetch status");

        const data = await res.json();
        setStatus(data.status);
        if (data.status === 'done') {
          setResultFile(data.result);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching job status:", err);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  // UI elements
  return (
    <div>
      <h1>Preview Page</h1>
      <p>Now previewing: <strong>{filename}</strong></p>

      <div style={{ display: 'flex', gap: '2rem'}}>
        <div>
          <h3>Original image</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={originalImgRef}
            src={`http://localhost:3000/thumbnail/${filename}`}
            alt={`Original ${filename}`}
            style={{ maxWidth: 300, maxHeight: 300 }}
          />
        </div>
        
        <div>
          <h3>Binarized Image</h3>
          <canvas
            ref={canvasRef}
            style={{ border: '1px solid black', maxWidth: 300, maxHeight: 300 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <label> Target Color: 
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label> Threshold: {threshold}
            <input
              type="range"
              min="0"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
            />
          </label>
        </div>

        <button>
          Preview
        </button>
      </div>

      <button onClick={handleStartProcess}>
        Process Video with These Settings
      </button>

      {status && <p>Status: <strong>{status}</strong></p>}

      {status === 'done' && resultFile && (
        <a href={`http://localhost:3000/results/${resultFile}`}> Download CSV result </a>
      )}

    </div>
  );
}