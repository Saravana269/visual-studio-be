
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage, Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Asterisk } from "lucide-react";

// Create a schema for screen name validation
const formSchema = z.object({
  name: z.string().min(1, "Screen name is required"),
});

interface ScreenNameStepProps {
  name: string;
  onChange: (name: string) => void;
}

export function ScreenNameStep({ name, onChange }: ScreenNameStepProps) {
  // Create form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
    mode: "onChange", // Validate on change for real-time feedback
  });

  // Update parent component state when form values change
  React.useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.name !== undefined) {
        onChange(values.name);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  // Set form values when prop changes
  React.useEffect(() => {
    form.reset({ name });
  }, [name, form]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-xl">Screen Name</FormLabel>
                  <Asterisk className="h-4 w-4 text-red-500" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter screen name"
                    className="bg-gray-950 border-gray-800 text-lg"
                    autoFocus
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
