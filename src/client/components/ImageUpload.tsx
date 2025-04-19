import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Button, TextField, Typography, Box, Stack } from '@mui/material';

interface ImageUploadProps {
  userId: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ userId }) => {
  const [url, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();



  useEffect(() => {
    getAllImages();
  }, []);

  const handleUploadWidget = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dcrrsec0d',
        uploadPreset: 'LetsGeaux Profile',
        sources: ['local', 'url', 'google_drive'],
        multiple: false,
        folder: 'letsGeaux',
      },
      (error: any, result: any) => {
        if (!error && result.event === 'success') {
          console.log('Uploaded image:', result.info.secure_url);
          setImageUrl(result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      enqueueSnackbar('Please upload an image first.', { variant: 'warning' });
      return;
    }

    try {
      await axios.post('/api/image', {
        url,
        notes,
        userId,
      });

      enqueueSnackbar('Upload successful!', { variant: 'success' });
      setImageUrl('');
      setNotes('');
      getAllImages(); // refresh images
    } catch (err) {
      console.error('Error submitting image & notes:', err);
    }
  };

  const getAllImages = async () => {
    try {
      const response = await axios.get(`/api/image/${userId}`);
      setImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      await axios.delete(`/api/image/${imageId}`);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
      enqueueSnackbar('Could not delete image.', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: 'auto', py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
        Upload an Image
      </Typography>
      <Stack spacing={2} alignItems="center">
        <Button
          variant="outlined"
          sx={{
            border: '4px solid black',
            borderRadius: 12,
            padding: '10px 20px',
            textTransform: 'uppercase',
            fontWeight: 700,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: '#eee',
            },
          }}
          onClick={handleUploadWidget}
        >
          Upload Image
        </Button>

        {url && (
          <Box sx={{ mt: 2 }}>
            <img
              src={url}
              alt="Uploaded preview"
              style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }}
            />
          </Box>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          <TextField
            placeholder="Add some notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            multiline
            fullWidth
            variant="outlined"
            sx={{
              marginTop: 2,
              '& .MuiOutlinedInput-root': {
                border: '4px solid black',
                borderRadius: 4,
              },
              '& .MuiInputBase-input': {
                padding: '10px',
                fontWeight: 500,
              },
            }}
          />

          <Button
            type="submit"
            variant="outlined"
            sx={{
              mt: 2,
              border: '4px solid black',
              borderRadius: 12,
              padding: '10px 20px',
              textTransform: 'uppercase',
              fontWeight: 700,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: '#eee',
              },
            }}
          >
            Submit
          </Button>
        </form>

        <Typography variant="h5" sx={{ textTransform: 'uppercase', fontWeight: 700, mt: 4 }}>
          Uploaded Images
        </Typography>
        {images.length === 0 ? (
          <Typography>No images uploaded yet.</Typography>
        ) : (
          images.map((image: any) => (
            <Box key={image.id} sx={{ mb: 4 }}>
              <img
                src={image.url}
                alt="Uploaded image"
                style={{ width: '200px', borderRadius: '4px' }}
              />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Notes: {image.notes}
              </Typography>
              <Button
                onClick={() => deleteImage(image.id)}
                sx={{
                  mt: 1,
                  color: 'white',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: '#ffdddd',
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ImageUpload;