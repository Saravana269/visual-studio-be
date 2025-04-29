
interface WidgetImageProps {
  imageUrl: string | null;
  altText: string;
}

export function WidgetImage({ imageUrl, altText }: WidgetImageProps) {
  if (!imageUrl) return null;
  
  return (
    <div className="w-full h-48 bg-muted rounded-md overflow-hidden">
      <img 
        src={imageUrl} 
        alt={altText} 
        className="w-full h-full object-cover" 
      />
    </div>
  );
}
