
import { ScreenConnection } from "@/types/connection";

/**
 * Combines connections from multiple sources, removing duplicates
 */
export function combineConnections(
  screenConnections: ScreenConnection[] = [],
  elementConnections: ScreenConnection[] = [],
  widgetConnections: ScreenConnection[] = []
): ScreenConnection[] {
  // Filter out duplicates by checking IDs
  return [
    ...screenConnections,
    ...elementConnections.filter(ec => 
      !screenConnections.some(sc => sc.id === ec.id)
    ),
    ...widgetConnections.filter(wc => 
      !screenConnections.some(sc => sc.id === wc.id) && 
      !elementConnections.some(ec => ec.id === wc.id)
    )
  ];
}

/**
 * Checks if a value from source matches a connection's source_value
 * Handles various formats of data comparison
 */
export function doesValueMatchConnection(value: any, connection: ScreenConnection): boolean {
  if (!connection.source_value) return false;
  
  const sourceValue = connection.source_value;
  let stringValue: string;
  
  try {
    // Handle various data formats
    if (typeof value === 'object') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }
    
    // Direct match
    if (sourceValue === stringValue) return true;
    
    // Handle JSON-like strings
    if (sourceValue.startsWith('[') || sourceValue.startsWith('{')) {
      try {
        const parsedSourceValue = JSON.parse(sourceValue);
        const parsedValue = typeof value === 'object' ? value : JSON.parse(stringValue);
        return JSON.stringify(parsedSourceValue) === JSON.stringify(parsedValue);
      } catch (e) {
        // If parsing fails, fall back to simple comparison
        return false;
      }
    }
    
    return false;
  } catch (e) {
    console.error("Error comparing values:", e);
    return false;
  }
}
