
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { TagSelector } from "./TagSelector";
import { JsonEditor } from "./JsonEditor";
import { CoeSelector } from "./CoeSelector";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Element } from "@/pages/ElementsManager";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image_url: z.string().optional().nullable(),
  properties: z.any().optional(),
  tags: z.array(z.string()).optional(),
  coe_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ElementFormDialogProps {
  element?: Element | null;
  open: boolean;
  onClose: (refreshList?: boolean) => void;
}

export function ElementFormDialog({ element, open, onClose }: ElementFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: element?.name || "",
      description: element?.description || "",
      image_url: element?.image_url || "",
      properties: element?.properties || {},
      tags: element?.tags || [],
      coe_ids: element?.coe_ids || [],
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const elementData = {
        name: values.name,
        description: values.description,
        image_url: values.image_url,
        properties: values.properties,
        tags: values.tags,
        coe_ids: values.coe_ids,
      };
      
      if (element) {
        // Update existing element
        const { error } = await supabase
          .from("elements")
          .update(elementData)
          .eq("id", element.id);
          
        if (error) throw error;
        
        toast({
          title: "Element updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        // Create new element
        const { error } = await supabase
          .from("elements")
          .insert([elementData]);
          
        if (error) throw error;
        
        toast({
          title: "Element created",
          description: `${values.name} has been created successfully.`,
        });
      }
      
      onClose(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {element ? `Edit Element: ${element.name}` : "Create New Element"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Element name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a description" 
                          className="min-h-[120px]" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <ImageUploader 
                          value={field.value || ""} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagSelector 
                          value={field.value || []} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="coe_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated COEs</FormLabel>
                      <FormControl>
                        <CoeSelector 
                          value={field.value || []} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="properties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>JSON Properties</FormLabel>
                  <FormControl>
                    <JsonEditor 
                      value={field.value || {}} 
                      onChange={field.onChange} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {element ? "Update" : "Create"} Element
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
