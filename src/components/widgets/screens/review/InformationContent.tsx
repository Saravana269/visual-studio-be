
interface InformationContentProps {
  metadata: Record<string, any>;
}

export function InformationContent({ metadata }: InformationContentProps) {
  return (
    <div className="p-4 mt-4 border border-[#00FF00]/20 rounded bg-black/30">
      <p className="text-gray-300 whitespace-pre-wrap">{metadata.text || "No information text provided."}</p>
    </div>
  );
}
