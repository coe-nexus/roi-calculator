// ProfilePicture.tsx
import React, { useState, useEffect } from 'react';
import { useApiData } from './ApiProvider';

interface ProfilePictureProps {
  className?: string;
  fallbackSrc?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ 
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>('');
  const [loading, setLoading] = useState(true);
  const { getTenantPfp } = useApiData();

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const fetchProfilePicture = async () => {
    try {
      setLoading(true);

      // Fetch SAS URL from your backend
      const sasUrl = await getTenantPfp("thumbnail")

      setImageUrl(sasUrl?.sasUrl);
      console.log("Image URL is set: ", sasUrl)
    } catch (err) {
      console.log('Error fetching profile picture:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse bg-gray-300 rounded-full`}>
        {/* Skeleton loader */}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Profile"
      className={className}
    />
  );
};

export default ProfilePicture;