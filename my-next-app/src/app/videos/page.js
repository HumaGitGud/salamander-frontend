// fetch and display list of videos

'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';

export default function VideoChooserPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('http://localhost:3000/videos'); // fetch from Express backend
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Video List</h1>
      {videos.map((video, i) => (
        <div key={i}>
            <Link href={`/preview/${video}`}>{video}</Link>
        </div>
      ))}
    </div>
  );
}