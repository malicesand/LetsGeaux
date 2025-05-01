// ImageContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext<any>(null);

export const useImageContext = () => useContext(ImageContext);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState([]);

  const deleteImage = (id: number) => {
    setImages((prev: any) => prev.filter((img: any) => img.id !== id));
  };

  return (
    <ImageContext.Provider value={{ images, setImages, deleteImage }}>
      {children}
    </ImageContext.Provider>
  );
};