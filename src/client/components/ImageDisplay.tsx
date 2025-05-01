import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Slider, Switch, FormControlLabel } from '@mui/material';
import { useImageContext } from './ImageContext';
//import { useLocation } from 'react-router-dom';

// interface Image {
//   id: string;
//   url: string;
//   notes: string;
// }

// interface ImageDisplayProps {
//   images: Image[];
//   deleteImage: (id: string) => void;
// }

const chunkArray = (arr: Image[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const ImageDisplay: React.FC = () => {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(true);
  const [flipInterval, setFlipInterval] = useState(3000); // ms

  const imageChunks = chunkArray(images, 2);
  //const location = useLocation();
  //const { images, deleteImage } = loca tion.state || { images: [], deleteImage: () => { } };
  const { images, deleteImage } = useImageContext();
  useEffect(() => {
    if (!autoFlip || imageChunks.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, flipInterval);

    return () => clearInterval(interval);
  }, [autoFlip, flipInterval, imageChunks.length]);

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentChunkIndex((prev) => (prev + 1) % imageChunks.length);
      setIsFlipping(false);
    }, 300); // match flip duration
  };

  const handlePrev = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentChunkIndex((prev) =>
        (prev - 1 + imageChunks.length) % imageChunks.length
      );
      setIsFlipping(false);
    }, 300);
  };

  return (
    <Box>
      <Typography variant="h3" align="center">
        Uploaded Images
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
        <Button variant="contained" onClick={handlePrev} disabled={imageChunks.length <= 1}>
          Previous
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={imageChunks.length <= 1}>
          Next
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={autoFlip}
              onChange={(e) => setAutoFlip(e.target.checked)}
            />
          }
          label="Auto Flip"
        />
        <Box width={200}>
          <Typography variant="caption">Speed (ms)</Typography>
          <Slider
            value={flipInterval}
            onChange={(_, value) => setFlipInterval(value as number)}
            step={500}
            min={1000}
            max={10000}
            disabled={!autoFlip}
          />
        </Box>
      </Box>

      {images.length === 0 ? (
        <Typography align="center" sx={{ mt: 2 }}>
          No images uploaded yet.
        </Typography>
      ) : (
        <Box
          className={isFlipping ? 'flip-animation' : ''}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            mt: 2,
            transition: 'transform 0.3s',
            transformStyle: 'preserve-3d',
          }}
        >
          {imageChunks[currentChunkIndex]?.map((image) => (
            <Box
              key={image.id}
              sx={{
                border: '2px solid black',
                borderRadius: 4,
                padding: 2,
                maxWidth: 220,
                textAlign: 'center',
                backgroundColor: 'white',
              }}
            >
              <img
                src={image.url}
                alt="Uploaded"
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <Typography variant="body1" sx={{ fontWeight: 500, mt: 1 }}>
                Notes: {image.notes}
              </Typography>
              <Button
                onClick={() => deleteImage(image.id)}
                variant="contained"
                color="primary"
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageDisplay;