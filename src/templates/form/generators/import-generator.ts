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
          // Check all combobox fields to see if both single and multi exist, and which library
          const comboboxFields = fields.filter((field) => field.type === FieldTypeEnum.COMBOBOX);
          const hasSingle = comboboxFields.some((field) => !field.isMulti);
          const hasMulti = comboboxFields.some((field) => field.isMulti);
          const hasBaseUI = comboboxFields.some((field) => (field.styleType || "base-ui") === "base-ui");
          const hasRadixUI = comboboxFields.some((field) => field.styleType === "radix-ui");

          const importStatements: string[] = [];
          
          // Base UI imports
          if (hasBaseUI) {
            const baseImports = ["Combobox"];
            if (hasSingle) {
              baseImports.push("ComboboxContent", "ComboboxEmpty", "ComboboxInput", "ComboboxItem", "ComboboxList");
            }
            if (hasMulti) {
              baseImports.push("ComboboxChip", "ComboboxChips", "ComboboxChipsInput", "ComboboxContent", "ComboboxEmpty", "ComboboxItem", "ComboboxList", "ComboboxValue", "useComboboxAnchor");
            }
            const baseUnique = Array.from(new Set(baseImports)).sort();
            importStatements.push(`import {
  ${baseUnique.join(",\n  ")},
} from "@/components/ui/combobox";`);
          }
          
          // Radix UI imports (Popover + Command pattern)
          if (hasRadixUI) {
            importStatements.push(`import {
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
import { cn } from "@/utils";`);
          }
          
          return importStatements.join("\n");

        default:
          return "";
      }
      
    })
    .join("\n");
};

export default importGenerator;
