
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);
  const [bucketExists, setBucketExists] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkBucketExists();
  }, []);

  const checkBucketExists = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket("elements");
      if (error || !data) {
        setBucketExists(false);
        toast({
          title: "Storage Setup Required",
          description: "Storage bucket not found. Please contact the administrator to set it up.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setBucketExists(false);
      console.error("Error checking bucket:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!bucketExists) {
      toast({
        title: "Upload Failed",
        description: "Storage bucket not found. Please contact the administrator to set it up.",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `element-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("elements")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from("elements")
        .getPublicUrl(filePath);

      setImagePreview(data.publicUrl);
      onChange(data.publicUrl);

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onChange("");
  };

  const handleExternalUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
    onChange(url);
  };

  if (!bucketExists) {
    return (
      <div className="border-2 border-dashed border-destructive/25 rounded-md p-6 text-center text-destructive">
        Storage bucket not found. Please contact the administrator to set it up.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {imagePreview ? (
        <div className="relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md"
            onError={() => {
              if (imagePreview !== value) {
                setImagePreview(null);
                onChange("");
                toast({
                  title: "Invalid image URL",
                  description: "The image URL provided is not valid.",
                  variant: "destructive",
                });
              }
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemoveImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center text-center">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop an image or click to browse
          </p>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            disabled={isUploading}
          >
            <label htmlFor="image-upload" className="cursor-pointer">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                "Select Image"
              )}
            </label>
          </Button>
        </div>
      )}

      <div>
        <p className="text-xs text-muted-foreground mb-1">Or enter an image URL:</p>
        <Input 
          type="url" 
          placeholder="https://example.com/image.jpg"
          value={imagePreview || ""}
          onChange={handleExternalUrl}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
