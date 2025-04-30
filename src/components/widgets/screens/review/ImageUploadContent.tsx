
interface ImageUploadContentProps {
  metadata: Record<string, any>;
}

export function ImageUploadContent({ metadata }: ImageUploadContentProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-400 mb-2">Image Upload:</h4>
      {metadata.image_url ? (
        <div className="p-1 border border-[#00FF00]/20 rounded bg-black/30">
          <img 
            src={metadata.image_url} 
            alt="Uploaded preview" 
            className="max-h-48 rounded object-contain mx-auto"
          />
        </div>
      ) : (
        <div className="p-4 border border-dashed border-[#00FF00]/20 rounded bg-black/30 text-center">
          <p className="text-gray-500">No image uploaded</p>
        </div>
      )}
    </div>
  );
}
