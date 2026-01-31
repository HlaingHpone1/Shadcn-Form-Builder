import { FieldTypeEnum } from "@/constants";
import defaultValuesGenerator from "@/templates/form/generators/DefaultValuesGenerator";
import fieldGenerator from "@/templates/form/generators/FieldGenerator";
import importGenerator from "@/templates/form/generators/import-generator";
import zodGenerator from "@/templates/form/generators/ZodGenerator";

export const generateCode = (
  fields: FormField[],
  componentInfo: ComponentInfo,
) => {
  const zodSchema = zodGenerator(fields);
  const jsxFields = fieldGenerator(fields);
  const header = importGenerator(fields);
  const defaultValues = defaultValuesGenerator(fields);

  // Check if any combobox field is multi-select (needs anchor ref)
  const hasMultiCombobox = fields.some(
    (field) => field.type === FieldTypeEnum.COMBOBOX && field.isMulti,
  );

  return `
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

${header}

const ${componentInfo.schemaName} = z.object({
${zodSchema}
})

export type ${componentInfo.schemaType} = z.infer<typeof ${componentInfo.schemaName}>

type Item = { id: number; name: string };

const data: Item[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

export default function ${componentInfo.functionName}() {
  const form = useForm<${componentInfo.schemaType}>({
    resolver: zodResolver(${componentInfo.schemaName}),
    defaultValues: {
      ${defaultValues}
    },
  })

  ${hasMultiCombobox ? "const anchorRef = useComboboxAnchor();" : ""}  

  function onSubmit(values: ${componentInfo.schemaType}) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
${jsxFields}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
  `.trim();
};
