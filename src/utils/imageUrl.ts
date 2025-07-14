
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it starts with /, remove it to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:8000/media';
  return `${baseUrl}/${cleanPath}`;
};
