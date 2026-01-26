import { DatePickerInput } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const data: { id: number; name: string }[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

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
