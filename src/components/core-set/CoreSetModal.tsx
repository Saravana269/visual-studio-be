
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/elements/ImageUploader";
import { TagSelector } from "@/components/elements/TagSelector";
import { CoeSelector } from "@/components/elements/CoeSelector";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { CoreSet } from "@/hooks/useCoreSetData";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image_url: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  source_coe_id: z.array(z.string()).optional().nullable(),
  source_element_id: z.string().optional().nullable(),
  destination_coe_id: z.array(z.string()).optional().nullable(),
  destination_element_ids: z.array(z.string()).optional().nullable()
});

type FormValues = z.infer<typeof formSchema>;

interface CoreSetModalProps {
  coreSet?: CoreSet | null;
  open: boolean;
  onClose: (refreshList?: boolean) => void;
}

export function CoreSetModal({
  coreSet,
  open,
  onClose
}: CoreSetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: coreSet?.name || "",
      description: coreSet?.description || "",
      image_url: coreSet?.image_url || "",
      tags: coreSet?.tags || [],
      source_coe_id: coreSet?.source_coe_id ? [coreSet.source_coe_id] : [],
      source_element_id: coreSet?.source_element_id || null,
      destination_coe_id: coreSet?.destination_coe_id ? [coreSet.destination_coe_id] : [],
      destination_element_ids: coreSet?.destination_element_ids || []
    }
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const coreSetData = {
        name: values.name,
        description: values.description,
        image_url: values.image_url,
        tags: values.tags,
        source_coe_id: values.source_coe_id && values.source_coe_id.length > 0 ? values.source_coe_id[0] : null,
        source_element_id: values.source_element_id,
        destination_coe_id: values.destination_coe_id && values.destination_coe_id.length > 0 ? values.destination_coe_id[0] : null,
        destination_element_ids: values.destination_element_ids
      };

      if (coreSet) {
        const { error } = await supabase.from("core_sets").update(coreSetData).eq("id", coreSet.id);
        if (error) throw error;
        toast({
          title: "Core Set updated",
          description: `${values.name} has been updated successfully.`
        });
      } else {
        const { error } = await supabase.from("core_sets").insert([coreSetData]);
        if (error) throw error;
        toast({
          title: "Core Set created",
          description: `${values.name} has been created successfully.`
        });
      }
      onClose(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {coreSet ? `Edit Core Set: ${coreSet.name}` : "Create New Core Set"}
          </DialogTitle>
          <DialogDescription>
            Create a new core set to manage your elements and COEs.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Core Set name" {...field} />
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
                    <ImageUploader value={field.value || ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector value={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source_coe_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source COE</FormLabel>
                  <FormControl>
                    <CoeSelector value={field.value || []} onChange={field.onChange} />
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
                {coreSet ? "Update" : "Create"} Core Set
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
