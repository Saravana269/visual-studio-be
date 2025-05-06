
import { useElementConnectionHandlers } from "./handlers/useElementConnectionHandlers";
import { useFrameworkConnectionHandlers } from "./handlers/useFrameworkConnectionHandlers";

/**
 * Combined hook that provides all connection handlers
 */
export function useConnectionHandlers(widgetId?: string) {
  // Get element-specific handlers
  const {
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
  } = useElementConnectionHandlers(widgetId);
  
  // Get framework-specific handlers
  const {
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework,
  } = useFrameworkConnectionHandlers(widgetId);
  
  return {
    // Element handlers
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    
    // Framework handlers
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  };
}
