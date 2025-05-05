import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useImageContext } from './ImageContext';

interface Image {
  id: number;
  url: string;
  notes: string;
}

interface ImageDisplayProps {
  userId: number;
}
const chunkArray = (arr: Image[], size: number): Image[][] => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ userId }) => {
  const { images, deleteImage, getAllImages } = useImageContext();
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [autoFlip, setAutoFlip] = useState(true);
  const [flipInterval, setFlipInterval] = useState(7000); // milliseconds

  const imageChunks = chunkArray(images, 2);

  useEffect(() => {
    if (!autoFlip || imageChunks.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, flipInterval);

    return () => clearInterval(interval);
  }, [autoFlip, flipInterval, imageChunks.length]);
  useEffect(() => {
    getAllImages(userId)
    console.log(userId)
  }, [userId])
  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentChunkIndex((prev) => (prev + 1) % imageChunks.length);
      setIsFlipping(false);
    }, 300);
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
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Uploaded Images
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        mt={2}
      >
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={imageChunks.length <= 1}
          fullWidth={true}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={imageChunks.length <= 1}
          fullWidth={true}
        >
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
          sx={{ whiteSpace: 'nowrap' }}
        />
        <Box width={{ xs: '100%', sm: 200 }}>
          <Typography variant="caption">Speed (ms)</Typography>
          <Slider
            value={flipInterval}
            onChange={(_, value) => setFlipInterval(value as number)}
            step={800}
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
            gap: 2,
            justifyContent: 'center',
            mt: 3,
            transition: 'transform 0.3s',
          }}
        >
          {imageChunks[currentChunkIndex]?.map((image) => (
            <Box
              key={image.id}
              sx={{
                border: '4px solid black',
                borderRadius: 2,
                p: 1,
                maxWidth: 200,
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'white',
              }}
            >
              <img
                src={image.url}
                alt="Uploaded"
                style={{
                  width: '100%',
                  borderRadius: '4px',
                  objectFit: 'cover',
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
                Notes: {image.notes}
              </Typography>
              <Button
                onClick={() => deleteImage(image.id)}
                variant="contained"
                color="black"
                sx={{ mt: 1 }}
                fullWidth
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ImageDisplay;