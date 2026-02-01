"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils";

const formSchema = z.object({
field_1: z.string().optional(),
field_2: z.string().optional(),
field_3: z.array(z.string()).optional()
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
    field_2: "",
    field_3: []
    },
  })

  const anchorRef = useComboboxAnchor();

  function onSubmit(values: MyFormType) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <FormField
  control={form.control}
  name="field_1"
  render={({ field }) => {
    const selectedItem = data.find((item) => item.id.toString() === field.value);

    return (
      <FormItem className="flex flex-col">
        <FormLabel>New Label
        
        </FormLabel>
        <Popover modal>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                type="button"
                className={cn(
                  'h-9 w-full justify-between truncate',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {field.value
                  ? selectedItem?.name
                  : "New Label"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput
                placeholder="Search..."
              />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      value={item.id.toString()}
                      key={item.id}
                      onSelect={() => {
                        if (item.id.toString() === field.value) {
                          field.onChange(undefined);
                        } else {
                          field.onChange(item.id.toString());
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          item.id.toString() === field.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    );
  }}
/>
          

          <FormField
  control={form.control}
  name="field_2"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>New Label
      
      </FormLabel>
      
      <FormControl>
        <Combobox
          items={data}
          itemToStringValue={(data) => data.id.toString()}
          itemToStringLabel={(data: Item) => data.name}
          onValueChange={(value) =>
            field.onChange(value ? value.id.toString() : undefined)
          }>
              <ComboboxInput
                placeholder="New Label"
                ref={field.ref}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
        </Combobox>
      </FormControl>
      
      <FormMessage />
    </FormItem>
  )}
/>
          

                    <FormField
          control={form.control}
          name="field_3"
          render={({ field }) => {
            const selectedItems = data.filter((item) =>
              field.value?.includes(item.id.toString()),
            );

            return (
              <FormItem className="flex flex-col">
               <FormLabel>New Label
      
      </FormLabel>
                <FormControl>
                  <div ref={anchorRef} className="w-full">
                    <Combobox
                      items={data}
                      multiple
                      autoHighlight
                      itemToStringLabel={(item) => item.name}
                      onValueChange={(selectedObjects: Item[]) => {
                        const ids = selectedObjects.map((obj) =>
                          obj.id.toString(),
                        );
                        field.onChange(ids);
                      }}
                    >
                      <ComboboxChips className="flex flex-wrap gap-2 p-2 w-full border rounded-md">
                        <ComboboxValue>
                          {selectedItems.map((item) => (
                            <ComboboxChip key={item.id} className="max-w-fit">
                              {item.name}
                            </ComboboxChip>
                          ))}
                        </ComboboxValue>
                        <ComboboxChipsInput className="flex-1 min-w-30" placeholder="New Label..." />
                      </ComboboxChips>
                      <ComboboxContent anchor={anchorRef} align="start">
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.id} value={item}>
                              {item.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
            
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}