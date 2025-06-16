// HOC for job status display

import { useState, useEffect } from 'react';

export function withJobStatus(WrappedComponent) {
  return function WithJobStatus(props) {
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState(null);
    const [resultFile, setResultFile] = useState(null);

    // fetch and display job status using interval
    useEffect(() => {
      if (!jobId) return;

      const interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:3000/process/${jobId}/status`);
          if (!res.ok) throw new Error("Failed to fetch status");

          const data = await res.json();
          setStatus(data.status);

          // ensure that the status is "done" and the file is ready for download
          if (data.status === 'done' && data.result) {
            setResultFile(data.result);  // file is ready for download
            clearInterval(interval);     // stop polling
          }
        } catch (err) {
          console.error("Error fetching job status:", err);
          clearInterval(interval);  // stop polling if there's an error
        }
      }, 2000);  // poll every 2 seconds

      return () => clearInterval(interval);  // cleanup on unmount
    }, [jobId]);

    return (
      <WrappedComponent
        {...props}
        jobId={jobId}
        setJobId={setJobId}
        status={status}
        resultFile={resultFile}
        setStatus={setStatus}
      />
    );
  };
}