
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye } from "lucide-react";

interface COE {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  element_count?: number;
}

interface COETableProps {
  coes: COE[];
  onEdit: (coe: COE) => void;
  onView: (coe: COE) => void;
}

const COETable = ({ coes, onEdit, onView }: COETableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Elements</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coes.map((coe) => (
            <TableRow 
              key={coe.id}
              className="cursor-pointer"
              onClick={() => onView(coe)}
            >
              <TableCell className="font-medium">{coe.name}</TableCell>
              <TableCell className="max-w-xs">
                <p className="line-clamp-1">{coe.description || "No description"}</p>
              </TableCell>
              <TableCell>
                <Badge>{coe.element_count || 0}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {coe.tags && coe.tags.length > 0 ? (
                    coe.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                  {coe.tags && coe.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{coe.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(coe);
                    }}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(coe);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default COETable;
