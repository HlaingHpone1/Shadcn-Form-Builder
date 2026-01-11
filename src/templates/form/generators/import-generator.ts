import { FieldTypeEnum } from "@/constants";

const importGenerator = (fields: FormField[]) => {
  return fields
    .filter(
      (field, index, self) =>
        index === self.findIndex((t) => t.type === field.type)
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
      }
    })
    .join("\n");
};

export default importGenerator;
