// Preview page (display video information when clicked from videos list)
// Still need to implement color picker and threshold to pass correct URL to fetch req

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

  const handleStartProcess = async () => {
    try {
      const res = await fetch(`http://localhost:3000/process/${filename}?targetColor=255,0,0&threshold=50`, {
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
    </div>
  );

}