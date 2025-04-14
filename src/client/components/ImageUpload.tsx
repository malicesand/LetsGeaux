import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ImageUploadProps {
  userId: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ userId }) => {
  const [url, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
        multiple: true,
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
      alert('Please upload an image first.');
      return;
    }

    try {
      await axios.post('/api/image', {
        url,
        notes,
        userId,
      });

      alert('Upload successful!');
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
      alert('Could not delete image.');
    }
  };


  return (
    <div>
      <h3>Upload an Image with Notes</h3>
      <button onClick={handleUploadWidget}>Upload Image</button>

      {url && (
        <div>
          <img
            src={url}
            alt="Uploaded preview"
            style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <textarea
          placeholder="Add some notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
        />
        <button type="submit" style={{ marginTop: '10px' }}>
          Submit
        </button>
      </form>

      <h3>Uploaded Images</h3>
      {images.length === 0 && <p>No images uploaded yet.</p>}
      {images.map((image: any) => (
        <div key={image.id} style={{ marginBottom: '20px' }}>
          <img src={image.url} alt="Uploaded image" style={{ width: '200px', borderRadius: '8px' }} />
          <div> Notes: {image.notes}</div> 
          <button onClick={() => deleteImage(image.id)} style={{ marginTop: '5px', color: 'red' }}>
      Delete
    </button>
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;