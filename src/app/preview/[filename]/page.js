// Preview page (display video information when clicked from videos list)
// Still need to implement color picker and threshold to pass correct URL to fetch req
// Still need to do proper tests

'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';

export default function PreviewPage({ params }) {
  const { filename } = use(params);

  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [resultFile, setResultFile] = useState(null);

  const thumbnailLoader = ({ src, width }) => {
    return `http://localhost:3000${src}?w=${width}`;
  };

  // make a POST request with a given link (targetColor and threshold are hardcoded rn)
  const handleStartProcess = async () => {
    try {
      const res = await fetch(`http://localhost:3000/process/${filename}?targetColor=000000&threshold=75`, {
        method: 'POST',
      });

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

      <Image loader={thumbnailLoader}
        src={`/thumbnail/${filename}`}
        alt={`Thumbnail for ${filename}`}
        width={240}
        height={240}
      />

      <button onClick={handleStartProcess} style={{ display:'block'}}>
        Start Process
      </button>

      {status && <p>Status: <strong>{status}</strong></p>}

      {status === 'done' && resultFile && (
        <a href={`http://localhost:3000/results/${resultFile}`}> Download CSV result </a>
      )}

    </div>
  );

}