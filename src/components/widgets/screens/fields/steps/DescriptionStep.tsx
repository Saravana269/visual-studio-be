
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormItem, FormLabel, FormControl, FormMessage, Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Asterisk } from "lucide-react";

// Create a schema for description validation
const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

interface DescriptionStepProps {
  description: string;
  onChange: (description: string) => void;
}

export function DescriptionStep({ description, onChange }: DescriptionStepProps) {
  // Create form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description,
    },
    mode: "onChange", // Validate on change for real-time feedback
  });

  // Update parent component state when form values change
  React.useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.description !== undefined) {
        onChange(values.description);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  // Set form values when prop changes
  React.useEffect(() => {
    form.reset({ description });
  }, [description, form]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-xl">Description</FormLabel>
                  <Asterisk className="h-4 w-4 text-red-500" />
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter screen description"
                    className="bg-gray-950 border-gray-800 text-lg"
                    rows={5}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
