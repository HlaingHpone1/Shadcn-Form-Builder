"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  field_1: z.string().optional(),
  field_3: z.z.array(z.number()).optional()
})

export type MyFormType = z.infer<typeof formSchema>

type Item = { id: number; name: string };

const data: Item[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

export default function MyGeneratedForm() {
  const form = useForm<MyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
          field_1: "",
    field_3: []
    },
  })

  

  function onSubmit(values: MyFormType) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                  control={form.control}
                  name="field_1"
                  render={({field}) => (
                    <FormItem>
                    <FormLabel>New Label  </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {data.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <RadioGroupItem
                                value={item.id.toString()}
                                id={`radio-${item.id}`}

                              />
                              <label
                                htmlFor={`radio-${item.id}`}
                                className="cursor-pointer text-sm"
                              >
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
              />
            

              <FormField
                  control={form.control}
                  name="field_3"
                  render={({field}) => (
                    <FormItem>
                    <FormLabel>New Label  </FormLabel>
                      {data
                        .map((item) =>
                          <div key={item.id} className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                                id={`checkbox-${item.id}`}
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) =>
                                field.onChange(
                                  checked
                                    ? [...(field?.value ?? []), item.id]
                                    : field.value?.filter((id: number) => id !== item.id)
                                )
                              } />
                          </FormControl>
                          <label
                            htmlFor={`checkbox-${item.id}`}
                            className="cursor-pointer"
                          >
                            {item.name}
                          </label>
                        </div>
                        )}
                      <FormMessage />
                    </FormItem>
                )}
              />
            
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}