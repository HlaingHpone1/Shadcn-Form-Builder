import { FieldTypeEnum, PASSWORD_RULES, PasswordRuleKey } from "@/constants";

const zodGenerator = (fields: FormField[]): string => {
  const schemaLines = fields.map((field) => {
    const label = `"${field.label} is required"`;

    const line = `  ${field.name}: z`;

    switch (field.type) {
      case FieldTypeEnum.TEXT:
        switch (field.formType) {
          case "text":
            return field.required
              ? line + `.string().nonempty(${label})`
              : line + `.string().optional()`;

          case "email":
            return field.required
              ? line + `.string().email(${label})`
              : line + `.string().email().optional()`;

          case "password":
            let schemaString = `z.string()\n`;

            // Add Min Length
            if (field.validation?.min) {
              schemaString += `.min(${field.validation.min}, "${field.label} must be at least ${field.validation.min} characters")\n`;
            }

            // Add Regex Chains
            if (field.validation?.patterns) {
              field.validation.patterns.forEach((key) => {
                const rule = PASSWORD_RULES[key as PasswordRuleKey];
                if (rule) {
                  schemaString +=
                    `.regex(new RegExp("${rule.regex.source}"), "${rule.message}")`.concat(
                      "\n",
                    );
                }
              });
            }

            if (field.required) {
              schemaString += `.nonempty("${field.label} is required")`;
            } else {
              schemaString += `.optional()`;
            }

            return `  ${field.name}: ${schemaString}`;

          default:
            return field.required
              ? line + `.string().nonempty(${label})`
              : line + `.string().optional()`;
        }

      case FieldTypeEnum.DATEPICKER:
        return field.required
          ? `  ${field.name}: z.string().nonempty("${field.label} is required")`
          : `  ${field.name}: z.string().optional()`;

      case FieldTypeEnum.CHECKBOX:
        return field.required
          ? `  ${field.name}: z.string().nonempty("${field.label} is required")`
          : `  ${field.name}: z.string().optional()`;

      case FieldTypeEnum.SELECT:
        return field.required
          ? `${field.name}: z.number({error: "${field.label} is required"})`
          : `${field.name}: z.number().optional()`;

      case FieldTypeEnum.COMBOBOX:
        if (field.isMulti) {
          return field.required
            ? `${field.name}: z.array(z.string()).nonempty("${field.label} is required"),`
            : `${field.name}: z.array(z.string()).optional()`;
        }

        return field.required
          ? `${field.name}: z.string().nonempty("${field.label} is required")`
          : `${field.name}: z.string().optional()`;

      default:
        return field.required
          ? `  ${field.name}: z.string().nonempty("${field.label} is required")`
          : `  ${field.name}: z.string().optional()`;
    }
  });

  return schemaLines.join(",\n");
};

export default zodGenerator;
