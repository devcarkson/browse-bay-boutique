// src/utils/imageUrl.ts
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';

  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:8000';

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
