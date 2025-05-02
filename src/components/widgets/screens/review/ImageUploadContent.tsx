
interface ImageUploadContentProps {
  metadata: Record<string, any>;
  onConnect?: (imageUrl: string) => void;
}

export function ImageUploadContent({ metadata, onConnect }: ImageUploadContentProps) {
  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium text-gray-400 mb-2">Image Upload:</h4>
      <div className="max-h-[200px] overflow-y-auto">
        {metadata.image_url ? (
          <div className="p-1 border border-[#00FF00] rounded bg-black/30">
            <img 
              src={metadata.image_url} 
              alt="Uploaded preview" 
              className="max-h-40 rounded object-contain mx-auto"
              onError={(e) => {
                // Handle error by showing a placeholder
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        ) : (
          <div className="p-3 border border-dashed border-[#00FF00]/20 rounded bg-black/30 text-center">
            <p className="text-gray-500 text-sm">No image uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
