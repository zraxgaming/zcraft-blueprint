import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Upload news or changelog image to Supabase storage
 * Bucket: imgs
 */
export async function uploadNewsImage(file: File, newsSlug: string): Promise<UploadResult> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Limit file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB');
    }

    const timestamp = Date.now();
    const fileName = `${newsSlug}-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = `news/${fileName}`;

    const { data, error } = await supabase.storage
      .from('imgs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('imgs')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    return {
      url: '',
      path: '',
      error: err?.message || 'Failed to upload image',
    };
  }
}

/**
 * Upload changelog image to Supabase storage
 * Bucket: imgs
 */
export async function uploadChangelogImage(file: File, version: string): Promise<UploadResult> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB');
    }

    const timestamp = Date.now();
    const sanitizedVersion = version.replace(/[^a-zA-Z0-9.-]/g, '');
    const fileName = `changelog-${sanitizedVersion}-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = `changelogs/${fileName}`;

    const { data, error } = await supabase.storage
      .from('imgs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('imgs')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    return {
      url: '',
      path: '',
      error: err?.message || 'Failed to upload image',
    };
  }
}

/**
 * Upload user profile picture to Supabase storage
 * Bucket: user_img
 */
export async function uploadProfilePicture(file: File, userId: string): Promise<UploadResult> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be smaller than 5MB');
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${userId}-${timestamp}.${extension}`;
    const filePath = `avatars/${fileName}`;

    // Delete old profile picture if exists
    try {
      const { data: files } = await supabase.storage
        .from('user_img')
        .list('avatars');

      if (files) {
        const oldFiles = files.filter(f => f.name.startsWith(userId));
        if (oldFiles.length > 0) {
          await supabase.storage
            .from('user_img')
            .remove(oldFiles.map(f => `avatars/${f.name}`));
        }
      }
    } catch (err) {
      console.warn('Failed to delete old profile picture:', err);
    }

    const { data, error } = await supabase.storage
      .from('user_img')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('user_img')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    return {
      url: '',
      path: '',
      error: err?.message || 'Failed to upload profile picture',
    };
  }
}

/**
 * Delete image from Supabase storage
 */
export async function deleteImage(bucket: 'imgs' | 'user_img', path: string): Promise<boolean> {
  try {
    if (!path) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (err: any) {
    console.error('Failed to delete image:', err);
    return false;
  }
}

/**
 * Get public URL for an image
 */
export function getImageUrl(bucket: 'imgs' | 'user_img', path: string): string {
  if (!path) return '';

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
