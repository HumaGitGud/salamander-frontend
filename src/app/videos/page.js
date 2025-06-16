'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function VideoChooserPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('http://localhost:3000/videos');
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h2" gutterBottom>
        Video List
      </Typography>

      <List>
        {videos.map((video, i) => (
          <ListItem key={i} component={Link} href={`/preview/${video}`}
            sx={{ textDecoration: 'none', '&:hover': { backgroundColor: '#f0f0f0'} }}>
              <ListItemText primary={video} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}