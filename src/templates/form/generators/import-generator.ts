import { FieldTypeEnum } from "@/constants";

const importGenerator = (fields: FormField[]) => {
  return fields
    .filter(
      (field, index, self) =>
        index === self.findIndex((t) => t.type === field.type),
    )
    .map((f) => {
      switch (f.type) {
        case FieldTypeEnum.CHECKBOX:
          return `import { Checkbox } from "@/components/ui/checkbox";`;
        case FieldTypeEnum.TEXT:
          switch (f.formType) {
            case "password":
              return `import { PasswordInput } from "@/components/ui/password-input";`;
          }
          return `import { Input } from "@/components/ui/input";`;

        case FieldTypeEnum.TEXTAREA:
          return `import { Textarea } from "@/components/ui/textarea";`;

        case FieldTypeEnum.SELECT:
          return `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';`;

        case FieldTypeEnum.DATEPICKER:
          return `import { DatePickerInput } from "@/components/date-picker";`;

        case FieldTypeEnum.COMBOBOX:
          // Check all combobox fields to see if both single and multi exist
          const comboboxFields = fields.filter((field) => field.type === FieldTypeEnum.COMBOBOX);
          const hasSingle = comboboxFields.some((field) => !field.isMulti);
          const hasMulti = comboboxFields.some((field) => field.isMulti);

          // Build combined imports if both types exist
          const imports = ["Combobox"];
          if (hasSingle) {
            imports.push("ComboboxContent", "ComboboxEmpty", "ComboboxInput", "ComboboxItem", "ComboboxList");
          }
          if (hasMulti) {
            imports.push("ComboboxChip", "ComboboxChips", "ComboboxChipsInput", "ComboboxContent", "ComboboxEmpty", "ComboboxItem", "ComboboxList", "ComboboxValue", "useComboboxAnchor");
          }

          // Remove duplicates and sort
          const uniqueImports = Array.from(new Set(imports)).sort();
          return `import {
  ${uniqueImports.join(",\n  ")},
} from "@/components/ui/combobox";`;

        default:
          return "";
      }
      
    })
    .join("\n");
};

export default importGenerator;
