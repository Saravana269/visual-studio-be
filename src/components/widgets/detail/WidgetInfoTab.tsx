
interface WidgetInfoTabProps {
  createdAt: string;
  updatedAt: string;
  id: string;
}

export function WidgetInfoTab({ createdAt, updatedAt, id }: WidgetInfoTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Created</h4>
        <p className="text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()} at{" "}
          {new Date(createdAt).toLocaleTimeString()}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Last Updated</h4>
        <p className="text-muted-foreground">
          {new Date(updatedAt).toLocaleDateString()} at{" "}
          {new Date(updatedAt).toLocaleTimeString()}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">ID</h4>
        <p className="text-muted-foreground text-xs font-mono">
          {id}
        </p>
      </div>
    </div>
  );
}
