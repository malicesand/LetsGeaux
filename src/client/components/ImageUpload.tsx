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
    <Box sx={{ mx: 'auto', margin: 'auto', py: 4 }}>
      <Box align="center"
        sx={{
          border: '4px solid black',
          borderRadius: 4,
          padding: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          mx: 'auto',

        }}
      >
        <Typography
          variant="h3"
          align='center'
          sx={{ py: 4 }}
        >
          Upload A Trip Image
        </Typography>

        <Box spacing={2} alignItems="center">
          <Button
            variant="contained"
            sx={{ mt: 2, color: 'primary' }}
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

          <form onSubmit={handleSubmit} style={{ marginTop: '10px', width: '100%' }}>
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
              variant="contained"
              sx={{ mt: 2, color: 'primary' }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>
      <Typography
        variant="h3"
        align='center'
      >
        Uploaded Images
      </Typography>

      {images.length === 0 ? (
        <Typography>No images uploaded yet.</Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {images.map((image: any) => (
            <Box
              key={image.id}
              sx={{
                border: '2px solid black',
                borderRadius: 4,
                padding: 2,
                maxWidth: 220,
                textAlign: 'center',
              }}
            >
              <img
                src={image.url}
                alt="Uploaded image"
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <Typography variant="body1" sx={{ fontWeight: 500, mt: 1 }}>
                Notes: {image.notes}
              </Typography>
              <Button
                onClick={() => deleteImage(image.id)}
                variant="contained"
                sx={{ mt: 1, color: 'primary' }}
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


export default ImageUpload;