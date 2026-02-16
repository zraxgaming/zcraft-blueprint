import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>; // Returns the image URL
  preview?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export function ImageUpload({
  onUpload,
  preview,
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5,
  disabled = false,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Please choose an image smaller than ${maxSize}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsLoading(true);
    try {
      const url = await onUpload(file);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err?.message || 'Failed to upload image',
        variant: 'destructive',
      });
      setPreviewUrl(preview || null);
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className="hidden"
        aria-label="Image upload input"
      />

      <div className="flex flex-col gap-3">
        {previewUrl && (
          <div className="relative w-full max-w-xs">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded-lg border border-muted"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemovePreview}
              disabled={isLoading}
              aria-label="Remove image preview"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading}
          className="gap-2"
          aria-label={`${label} button`}
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {label}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
