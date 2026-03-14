import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ProfilePictureProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
  showUploadButton?: boolean;
}

export function ProfilePicture({
  size = 'md',
  editable = false,
  className = '',
  showUploadButton = true
}: ProfilePictureProps) {
  const { userProfile, updateProfilePicture } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 2MB.',
        variant: 'destructive'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview || !fileInputRef.current?.files?.[0]) return;

    try {
      setUploading(true);
      const file = fileInputRef.current.files[0];
      await updateProfilePicture(file);
      setPreview(null);
      toast({
        title: 'Profile picture updated!',
        description: 'Your profile picture has been successfully updated.'
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload profile picture.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    if (userProfile?.username) {
      return userProfile.username.substring(0, 2).toUpperCase();
    }
    if (userProfile?.email) {
      return userProfile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const avatarUrl = preview || userProfile?.avatar_url;

  return (
    <div className={`relative ${className}`}>
      <Avatar className={`${sizeClasses[size]} ring-2 ring-background shadow-lg`}>
        <AvatarImage
          src={avatarUrl || undefined}
          alt={`${userProfile?.username || 'User'}'s profile picture`}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      {editable && showUploadButton && (
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          {preview ? (
            <>
              <Button
                size="sm"
                variant="default"
                className="h-6 w-6 p-0 rounded-full"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-6 w-6 p-0 rounded-full"
                onClick={handleCancel}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full shadow-md"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile picture"
      />

      {/* Accessibility: Screen reader description */}
      <div className="sr-only">
        Profile picture for {userProfile?.username || 'user'}.
        {editable && ' Click the camera button to upload a new picture.'}
      </div>
    </div>
  );
}