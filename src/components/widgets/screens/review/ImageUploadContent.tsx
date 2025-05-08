
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageUploadContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (imageUrl: string) => void;
}

export function ImageUploadContent({ metadata, screenId, onConnect }: ImageUploadContentProps) {
  const imageUrl = metadata.image_url || "";
  
  return (
    <div className="mt-4">
      {imageUrl ? (
        <div className="relative border border-[#00FF00]/20 rounded-md overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-[200px] border border-[#00FF00]/20 rounded-md bg-black/30">
          <p className="text-gray-400">No image uploaded</p>
        </div>
      )}
    </div>
  );
}
