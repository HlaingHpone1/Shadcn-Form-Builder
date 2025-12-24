import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z.object({
  field_1: z.string().nonempty("New Label is required")

})

const data: { id: number; name: string }[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

export function MyGeneratedForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        field_1: ""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="field_1"
                render={({ field }) => (
                  <FormItem className="gap-3">
                    <FormLabel>
                      New Label <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="off"
                        placeholder="New Label..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}