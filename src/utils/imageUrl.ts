// src/utils/imageUrl.ts
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';

  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:8000';
  // const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'https://makelacosmetic.uk';

  // If imagePath is already a full URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If imagePath starts with "/media"
  if (imagePath.startsWith('/media')) {
    return `${baseUrl}${imagePath}`;
  }

  // Otherwise assume it's inside media/
  return `${baseUrl}/media/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`;
};

// Helper function to get the first image from an array or single image
export const getFirstImage = (images: string[] | string | undefined): string => {
  if (!images) return '/placeholder.svg';
  
  if (Array.isArray(images)) {
    return images.length > 0 ? getImageUrl(images[0]) : '/placeholder.svg';
  }
  
  return getImageUrl(images);
};
