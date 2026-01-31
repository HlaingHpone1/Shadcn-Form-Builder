import { DatePickerInput } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldTypeEnum } from "@/constants";
import { useState } from "react";

type Item =  { id: number; name: string }
const data:Item[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

const MultiComboboxPreview = ({ field }: { field: FormField }) => {
  const anchorRef = useComboboxAnchor();  
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  return (
    <div ref={anchorRef} className="w-full">
      <Combobox
        items={data}
        multiple
        autoHighlight
        itemToStringLabel={(item) => item.name}
        onValueChange={(selectedObjects: Item[]) => {
          setSelectedItems(selectedObjects);
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
          <ComboboxChipsInput className="flex-1 min-w-30" placeholder={`${field.label}...`} />
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
  );
};

const PreviewTab = ({ fields }: { fields: FormField[] }) => {

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-4">
      <div className="sticky top-0 bg-white z-10 pb-4 border-b mb-4">
        <h2 className="text-lg font-semibold">Form Preview</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {fields.length} {fields.length === 1 ? "field" : "fields"}
        </p>
      </div>
      {fields.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-sm">No fields to preview yet.</p>
          <p className="text-xs mt-1">Add fields from the builder panel.</p>
        </div>
      ) : (
        <>
          {/* Note: This is a visual simulation. In a real app, use React Hook Form here too */}
          {fields.map((f) => (
            <div key={f.id} className="grid w-full items-center gap-1.5">
              <Label htmlFor={f.name} className="text-sm">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </Label>
              {f.type === FieldTypeEnum.TEXT && f.formType !== "password" && (
                <Input id={f.name} placeholder={f.label} className="h-9" />
              )}

              {f.type === FieldTypeEnum.TEXT && f.formType === "password" && (
                <PasswordInput id={f.name} placeholder={f.label} type="password" className="h-9" />
              )}
              {f.type === FieldTypeEnum.TEXTAREA && (
                <Textarea id={f.name} placeholder={f.label} className="min-h-[80px]" />
              )}
              {f.type === FieldTypeEnum.CHECKBOX && (
                <div className="space-y-3 py-2">
                  {data.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`checkbox-${f.id}-${item.id}`}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`checkbox-${f.id}-${item.id}`}
                        className="cursor-pointer text-sm"
                      >
                        {item.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {f.type === FieldTypeEnum.SELECT && (
                <Select>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select Data" />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper">
                    {data.map((item) => (
                      <SelectItem value={item.id.toString()} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {f.type === FieldTypeEnum.DATEPICKER && (
                <DatePickerInput
                  value={new Date()}
                  onChange={() => {}}
                  placeholder={f.label}
                  className="w-full h-9"
                />
              )}

              {f.type === FieldTypeEnum.COMBOBOX && !f.isMulti && (
                <Combobox
                  items={data}
                  itemToStringValue={(item: Item) => (item ? item.id.toString() : "")}
                  itemToStringLabel={(item) => (item ? item.name : "")}
                >
                  <ComboboxInput 
                    placeholder={f.label} 
                    className="h-9" 
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
              )}

              {f.type === FieldTypeEnum.COMBOBOX && f.isMulti && (
                <MultiComboboxPreview field={f} />
              )}
            </div>
          ))}
          <div className="pt-4 border-t mt-4">
            <Button className="w-full">Submit</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewTab;
