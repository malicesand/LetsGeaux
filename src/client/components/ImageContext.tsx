import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface Image {
  id: number;
  url: string;
  notes: string;
}

interface ImageContextType {
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  deleteImage: (id: number) => void;
  getAllImages: (userId: number) => Promise<void>;
}

const ImageContext = createContext<ImageContextType | null>(null);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) throw new Error("useImageContext must be used within an ImageProvider");
  return context;
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<Image[]>([]);

  const deleteImage = (id: number) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const getAllImages = async (userId: number) => {
    try {
      const response = await axios.get(`/api/image/${userId}`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <ImageContext.Provider value={{ images, setImages, deleteImage, getAllImages }}>
      {children}
    </ImageContext.Provider>
  );
};