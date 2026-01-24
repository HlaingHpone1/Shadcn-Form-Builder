"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DatePickerInput } from "@/components/date-picker";

const formSchema = z.object({
  field_1: z.string().optional(),
});

export type MyFormType = z.infer<typeof formSchema>;

const data: { id: number; name: string }[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

export default function Test() {
  const form = useForm<MyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field_1: "",
    },
  });

  function onSubmit(values: MyFormType) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="field_1"
          render={({ field }) => {
            const { value, onChange, ...rest } = field;
            return (
              <FormItem className="flex flex-col">
                <FormLabel>New Label </FormLabel>
                <FormControl>
                  <DatePickerInput
                    value={value ? new Date(value) : undefined}
                    onChange={(date) =>
                      onChange(date ? date.toISOString() : undefined)
                    }
                    {...rest}
                    placeholder="New Label..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
