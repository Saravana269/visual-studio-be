
export interface GroupData {
  id: string;
  name: string;
  color: string;
  description?: string;
  collapsed?: boolean;
}

export interface GroupMapping {
  [coeId: string]: string; // maps COE ID to group ID
}
