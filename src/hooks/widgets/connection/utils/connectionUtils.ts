
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
