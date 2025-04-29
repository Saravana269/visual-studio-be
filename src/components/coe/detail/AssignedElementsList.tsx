
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Element {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  primary_tag_id: string | null;
  tags: string[] | null;
}

interface AssignedElementsListProps {
  assignedElements: Element[];
}

export const AssignedElementsList = ({ assignedElements }: AssignedElementsListProps) => {
  if (assignedElements.length === 0) {
    return (
      <div className="col-span-full text-center py-8 border rounded-lg bg-muted">
        <p className="text-muted-foreground">No elements assigned yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assignedElements.map((element) => (
        <Card key={element.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {element.image_url && (
                <img 
                  src={element.image_url} 
                  alt={element.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h4 className="font-medium">{element.name}</h4>
                {element.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {element.description}
                  </p>
                )}
                {element.primary_tag_id && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Has primary tag
                    </Badge>
                  </div>
                )}
                {element.tags && element.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {element.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
