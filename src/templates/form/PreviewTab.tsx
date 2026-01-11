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
    <div className="max-w-md mx-auto space-y-6 border p-8 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
      {/* Note: This is a visual simulation. In a real app, use React Hook Form here too */}
      {fields.map((f) => (
        <div key={f.id} className="grid w-full items-center gap-1.5 mb-5">
          <Label htmlFor={f.name} className="mb-2">
            {f.label} {f.required && <span className="text-red-500">*</span>}
          </Label>
          {f.type === FieldTypeEnum.TEXT && f.formType !== "password" && (
            <Input id={f.name} placeholder={f.label} />
          )}

          {f.type === FieldTypeEnum.TEXT && f.formType === "password" && (
            <PasswordInput id={f.name} placeholder={f.label} type="password" />
          )}
          {f.type === FieldTypeEnum.TEXTAREA && (
            <Textarea id={f.name} placeholder={f.label} />
          )}
          {f.type === FieldTypeEnum.CHECKBOX && (
            <div className="space-y-5">
              {data.map((item) => (
                <div key={item.id} className="flex items-center gap-2 ">
                  <Checkbox
                    id={`checkbox-${item.id}`}
                    className="cursor-pointer"
                  />
                  <Label
                    htmlFor={`checkbox-${item.id}`}
                    className="cursor-pointer"
                  >
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {f.type === FieldTypeEnum.SELECT && (
            <Select>
              <SelectTrigger className="w-full">
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
        </div>
      ))}
      <Button className="w-full">Submit</Button>
    </div>
  );
};

export default PreviewTab;
