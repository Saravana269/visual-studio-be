
// This file now re-exports everything from the new structure
// for backward compatibility
import { Screen } from "@/types/screen";
export { ConnectionDialogContext, ConnectionDialogProvider, useConnectionDialogs } from './connection';

// Add the Screen interface to the Screen type to include framework_id
// This is needed for backward compatibility
declare module '@/types/screen' {
  interface Screen {
    framework_id?: string | null;
  }
}
