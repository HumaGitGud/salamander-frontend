// Home page

'use client';

import { useEffect, useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';

// lizards floating animation
export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const emojis = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      size: 20 + Math.random() * 20,
      symbol: '🐊',
    }));

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      emojis.forEach(e => {
        e.x += e.dx;
        e.y += e.dy;
        if (e.x < 0 || e.x > canvas.width) e.dx *= -1;
        if (e.y < 0 || e.y > canvas.height) e.dy *= -1;
        ctx.font = `${e.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.symbol, e.x, e.y);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />

    <Container>
      <Box 
        component="video" 
        src="/salamander.mp4" 
        autoPlay 
        muted
        loop 
        playsInline
        sx={{
          width: 400,
          height: 'auto',
          display: 'block',
          margin: 'auto',
          borderRadius: 10,
          mb: 2,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, color: 'text.primary' }}>
        <Typography variant="h1" gutterBottom>
          Centroid Finder App
        </Typography>

        <Typography variant="body1" mb={4}>
          An easy-to-use tool for detecting, analyzing, and tracking centroids in images and videos based on chosen color thresholds
        </Typography>

        <Box component="section" mb={4}>
          <Typography variant="h2" gutterBottom>Key Features:</Typography>
          <ul>
            <li><strong>Binarize and Analyze Images:</strong> Access any thumbnail image and choose a color to find connected regions based on color similarity</li>
            <li><strong>Video Frame Processing:</strong> Select a video and let Centroid Finder process each frame, tracking the largest centroid and generating real-time results that can be saved to CSV</li>
            <li><strong>Real-Time Visualization:</strong> Preview a video thumbnail with desired color and threshold in real-time interactively</li>
            <li><strong>Export Results:</strong> Save centroid data to CSV files for further analysis or use in other settings</li>
          </ul>
        </Box>

        <Box component="section">
          <Typography variant="h2" gutterBottom>How It Works:</Typography>
          <ol>
            <li><strong>Select videos from directory:</strong> Detect your media files to get started</li>
            <li><strong>Set Parameters:</strong> Define your target color and the threshold for color similarity</li>
            <li><strong>Get Results:</strong> Process a video by detecting connected regions and calculating centroids</li>
          </ol>
        </Box>

      </Box>
    </Container>
    </>
  );
}