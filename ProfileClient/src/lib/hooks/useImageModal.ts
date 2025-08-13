import { useState } from 'react';

export const useImageModal = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    openImage,
    closeImage,
  };
};