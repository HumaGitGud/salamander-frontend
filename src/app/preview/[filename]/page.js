// Preview page (display video information when clicked from videos list)

'use client';

import { use } from 'react';
import Image from 'next/image';

export default function PreviewPage({ params }) {
  // unwrap params with 'use' hook handle async behavior
  const { filename } = use(params);

  // thumbnail loader function (adds width to image URL for optimization)
  const thumbnailLoader = ({ src, width }) => {
    return `http://localhost:3000${src}?w=${width}`;
  };

  return (
    <div>
      <h1>Preview Page</h1>
      <p>Now previewing: <strong>{filename}</strong></p>

      <Image 
        loader={thumbnailLoader}
        src={`/thumbnail/${filename}`}
        alt={`Thumbnail for ${filename}`}
        width={240}
        height={240}
      />
    </div>
  );
}