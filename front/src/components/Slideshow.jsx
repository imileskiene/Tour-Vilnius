// Slideshow.js
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

function Slideshow({ images, interval = 2000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <Box
      className="slideshow-container"
      sx={{
        position: 'relative',
        width: '100%', // galite nustatyti konkretų plotį arba %
        height: '450px', // nustatykite fiksuotą aukštį
        overflow: 'hidden', // užtikrina, kad niekas neperžengtų ribų
      }}
    >
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="slideshow-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // pritaikyti, kaip vaizdas turi tilpti
          position: 'absolute', // kad tik vienas vaizdas būtų matomas vienu metu
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
}

export default Slideshow;
