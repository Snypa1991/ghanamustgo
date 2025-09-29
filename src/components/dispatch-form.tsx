
"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  recipientName: z.string().min(1, "Recipient's name is required"),
  recipientPhone: z.string().min(1, "Recipient's phone is required"),
  packageSize: z.enum(['small', 'medium', 'large']),
  packageDescription: z.string().min(3, "Please describe the package"),
});

type DispatchFormValues = z.infer<typeof formSchema>;

interface DispatchFormProps {
  onSubmit: (values: DispatchFormValues) => void;
  isLoading: boolean;
}

export default function DispatchForm({ onSubmit, isLoading }: DispatchFormProps) {
  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: '',
      recipientPhone: '',
      packageSize: 'small',
      packageDescription: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Name</FormLabel>
              <FormControl><Input placeholder="Ama Mensah" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipientPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient Phone</FormLabel>
              <FormControl><Input placeholder="024 123 4567" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="packageSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select package size" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="small">Small (Envelope, food pack)</SelectItem>
                  <SelectItem value="medium">Medium (Shoe box, laptop bag)</SelectItem>
                  <SelectItem value="large">Large (Small suitcase, box)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="packageDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Description</FormLabel>
              <FormControl><Textarea placeholder="e.g., A gift-wrapped shoe box" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full h-11">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
          Get Delivery Fee
        </Button>
      </form>
    </Form>
  );
}
