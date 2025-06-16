// Preview page (display video information when clicked from videos list)

'use client';

import { useState, useEffect, useRef, use } from 'react';
import { binarizeImage } from './processor.js';

export default function PreviewPage({ params }) {
  const { filename } = use(params);

  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [resultFile, setResultFile] = useState(null);

  const [color, setColor] = useState('#000000'); // default black
  const [threshold, setThreshold] = useState(75); // default 75
  const [binarizeSettings, setBinarizeSettings] = useState(null); // color/threshold, or null
  const originalImgRef = useRef(null);
  const canvasRef = useRef(null);

  // set canvas size and draw the binarized image
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = originalImgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');

    // set the canvas size based on the image size
    const setCanvasSize = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    };

    const drawBinarized = () => {
      if (!binarizeSettings) {
        // clear canvas and fill with black if no binarizeSettings
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      // create offscreen canvas to get pixel data
      const offCanvas = document.createElement('canvas');
      offCanvas.width = img.naturalWidth;
      offCanvas.height = img.naturalHeight;
      const offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(img, 0, 0);

      const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);

      const { binarizedImageData, centroid } = binarizeImage(
        imageData,
        binarizeSettings.color,
        binarizeSettings.threshold
      );

      // put the binarized data on the canvas
      ctx.putImageData(binarizedImageData, 0, 0);

      // draw the centroid if it exists
      if (centroid) {
        ctx.beginPath();
        ctx.arc(centroid.x, centroid.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      }
    };

    // set the canvas size and then draw the image
    if (!img.complete) {
      img.onload = () => {
        setCanvasSize();
        drawBinarized();
      };
    } else {
      setCanvasSize();
      drawBinarized();
    }

  }, [binarizeSettings, filename]); // trigger whenever binarizeSettings or filename change

  // trigger binarizeSettings update when color or threshold changes
  useEffect(() => {
    setBinarizeSettings({ color, threshold });
  }, [color, threshold]);
  
  // handle color change only if new value is different
  const handleColorChange = (e) => {
    if (e.target.value !== color) {
      setColor(e.target.value);
    }
  };

  // make a POST request with a given link - start processing job using saved binarizeSettings
  const handleStartProcess = async () => {
    if (!binarizeSettings) {
      alert("Please preview the binarized image first before processing.");
      return;
    }
    try {
      const hex = binarizeSettings.color.replace('#', '').toUpperCase();
      const res = await fetch(
        `http://localhost:3000/process/${filename}?targetColor=${hex}&threshold=${binarizeSettings.threshold}`,
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
          <h3>Original Image</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={originalImgRef}
            src={`http://localhost:3000/thumbnail/${filename}`}
            alt={`Original ${filename}`}
            style={{ maxWidth: 300, maxHeight: 300 }}
            crossOrigin="anonymous"
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