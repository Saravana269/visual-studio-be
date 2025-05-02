
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  maxSize?: number; // in MB
  folderPath?: string;
}

export function ImageUploader({ 
  value, 
  onChange, 
  maxSize = 5, // Default max size: 5MB
  folderPath = "element-images" 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);
  const { toast } = useToast();

  // Update preview when value changes externally
  useEffect(() => {
    setImagePreview(value || null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Image must be smaller than ${maxSize}MB.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Authentication required");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("elements")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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

  return (
    <div className="space-y-4">
      {imagePreview ? (
        <div className="relative">
          <div className="p-3 bg-gray-900 border border-[#00FF00] rounded-md">
            <img 
              src={imagePreview} 
              alt="Uploaded preview" 
              className="w-full h-48 object-contain rounded-md"
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
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8"
            onClick={handleRemoveImage}
          >
            <Trash size={16} className="mr-1" />
            Remove
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
            variant="default"
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
                "Upload Image"
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
