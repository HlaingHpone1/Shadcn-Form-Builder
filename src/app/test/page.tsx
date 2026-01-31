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

const formSchema = z.object({
  field_1: z.string().optional(),
  field_2: z.array(z.string()).optional(),
});

export type MyFormType = z.infer<typeof formSchema>;

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
      field_2: [],
    },
  });

  const anchorRef = useComboboxAnchor();

  function onSubmit(values: MyFormType) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl"
      >
        <FormField
          control={form.control}
          name="field_1"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>New Label</FormLabel>

              <FormControl>
                <Combobox
                  items={data}
                  itemToStringValue={(data) => data.id.toString()}
                  itemToStringLabel={(data: Item) => data.name}
                  onValueChange={(value) =>
                    field.onChange(value ? value.id.toString() : undefined)
                  }
                >
                  <ComboboxInput
                    placeholder="Select the New Label"
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
          name="field_2"
          render={({ field }) => {
            const selectedItems = data.filter((item) =>
              field.value?.includes(item.id.toString()),
            );

            return (
              <FormItem className="flex flex-col">
                <FormLabel>New Label</FormLabel>
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
                        <ComboboxChipsInput
                          className="flex-1 min-w-30"
                          placeholder="New Label..."
                        />
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
  );
}
