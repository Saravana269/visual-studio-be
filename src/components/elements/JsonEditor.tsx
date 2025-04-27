
import { useEffect, useRef, useState } from "react";
import { editor } from "monaco-editor";
import { Loader2 } from "lucide-react";

interface JsonEditorProps {
  value: any;
  onChange: (value: any) => void;
}

export function JsonEditor({ value, onChange }: JsonEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState(true);

  useEffect(() => {
    let monaco: typeof import("monaco-editor") | null = null;
    
    const initMonaco = async () => {
      try {
        setIsLoading(true);
        
        // Dynamically import Monaco editor
        monaco = await import("monaco-editor");
        
        if (editorContainerRef.current) {
          // Create editor instance
          editorInstanceRef.current = monaco.editor.create(editorContainerRef.current, {
            value: JSON.stringify(value, null, 2),
            language: "json",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            tabSize: 2,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
            },
          });
          
          // Add change event listener
          editorInstanceRef.current.onDidChangeModelContent(() => {
            try {
              const editorValue = editorInstanceRef.current?.getValue() || "{}";
              const parsedValue = JSON.parse(editorValue);
              onChange(parsedValue);
              setError(null);
              setIsValidJson(true);
            } catch (err) {
              setError("Invalid JSON format. Please correct it before proceeding.");
              setIsValidJson(false);
            }
          });
        }
      } catch (err) {
        console.error("Failed to load Monaco editor:", err);
        setError("Failed to load the code editor");
      } finally {
        setIsLoading(false);
      }
    };

    initMonaco();

    return () => {
      // Dispose editor instance on unmount
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
      }
    };
  }, []);
  
  // Update editor content when value prop changes from outside
  useEffect(() => {
    if (editorInstanceRef.current) {
      const currentValue = editorInstanceRef.current.getValue();
      const newValue = JSON.stringify(value, null, 2);
      
      if (currentValue !== newValue) {
        editorInstanceRef.current.setValue(newValue);
      }
    }
  }, [value]);

  return (
    <div className="relative border rounded-md overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="p-2 text-xs bg-destructive/20 text-destructive">
          {error}
        </div>
      )}
      
      <div 
        ref={editorContainerRef} 
        className={`min-h-[200px] w-full ${!isValidJson ? 'border-destructive' : ''}`}
        aria-label="JSON editor"
      />
    </div>
  );
}
