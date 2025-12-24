"use client";

import React, { HTMLInputTypeAttribute, useState } from "react";
import { Plus, Trash2, Code, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PASSWORD_RULES, PasswordRuleKey } from "@/constants";

// --- Types ---
type FieldType =
  | "TEXT"
  | "TEXTAREA"
  | "CHECKBOX"
  | "SELECT"
  | "RADIO"
  | "DATEPICKER"
  | "COMBOBOX"
  | "NUMBER";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  formType?: HTMLInputTypeAttribute;
  validation?: ValidationRules;
}

type ValidationRules = {
  min?: number;
  max?: number;
  patterns?: string[];
  isEmail?: boolean;
};

interface ComponentItem {
  type: FieldType;
  label: string;
  formType: HTMLInputTypeAttribute;
}

enum FieldTypeEnum {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  CHECKBOX = "CHECKBOX",
  SELECT = "SELECT",
  RADIO = "RADIO",
  DATEPICKER = "DATEPICKER",
  COMBOBOX = "COMBOBOX",
  NUMBER = "NUMBER",
}

const componentList: ComponentItem[] = [
  {
    type: "TEXT",
    label: "Text Box",
    formType: "text",
  },
  {
    type: "TEXTAREA",
    label: "Textarea",
    formType: "text",
  },
  {
    type: "SELECT",
    label: "Select",
    formType: "text",
  },
  {
    type: "CHECKBOX",
    label: "Checkbox",
    formType: "checkbox",
  },
  {
    type: "DATEPICKER",
    label: "Datepicker",
    formType: "text",
  },
  {
    type: "COMBOBOX",
    label: "Combobox",
    formType: "text",
  },
  {
    type: "RADIO",
    label: "Radio",
    formType: "text",
  },
];

const data: { id: number; name: string }[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Helper to get currently selected field object
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const addField = (type: FieldType) => {
    const id = crypto.randomUUID();
    setFields([
      ...fields,
      {
        id,
        name: `field_${fields.length + 1}`,
        label: "New Label",
        type,
        required: false,
        formType: type === FieldTypeEnum.NUMBER ? "number" : "text",
      },
    ]);
    setSelectedFieldId(id);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  };

  const handleValidationChange = (key: string, value: unknown) => {
    updateField(selectedField!.id, {
      validation: {
        ...selectedField?.validation,
        [key]: value,
      },
    });
  };

  const handlePatternToggle = (ruleKey: string, checked: boolean) => {
    const currentPatterns = selectedField?.validation?.patterns || [];
    let newPatterns;

    if (checked) {
      // Add key if not present
      newPatterns = [...currentPatterns, ruleKey];
    } else {
      // Remove key
      newPatterns = currentPatterns.filter((p) => p !== ruleKey);
    }

    updateField(selectedFieldId!, {
      validation: { ...selectedField?.validation, patterns: newPatterns },
    });
  };

  // --- Code Generator ---
  const generateCode = () => {
    const zodSchema = fields
      .map((f) => {
        if (f.type === FieldTypeEnum.CHECKBOX) {
          return f.required
            ? `  ${f.name}: z.array(z.number()).min(1, "${f.label} is required")`
            : `  ${f.name}: z.array(z.number()).optional()`;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType === "text") {
          return f.required
            ? `  ${f.name}: z.string().nonempty("${f.label} is required")`
            : `  ${f.name}: z.string().optional()`;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType === "email") {
          return f.required
            ? `  ${f.name}: z.string().email("${f.label} is required")`
            : `  ${f.name}: z.string().email().optional()`;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType === "password") {
          // Start the chain
          let schemaString = `z.string()`;

          // Add optional/required
          if (f.required) {
            schemaString += `.nonempty("${f.label} is required")`.concat("\n");
          } else {
            schemaString += `.optional()`.concat("\n");
          }

          // Add Regex Chains
          if (f.validation?.patterns) {
            f.validation.patterns.forEach((key) => {
              const rule = PASSWORD_RULES[key as PasswordRuleKey];
              if (rule) {
                // We use rule.regex.source to get the raw regex string without slashes
                schemaString +=
                  `.regex(new RegExp("${rule.regex.source}"), "${rule.message}")`.concat(
                    "\n"
                  );
              }
            });
          }

          // Add Min Length
          if (f.validation?.min) {
            schemaString += `.min(${f.validation.min}, "${f.label} must be at least ${f.validation.min} characters")`;
          }

          return `  ${f.name}: ${schemaString}`;
        }

        if (f.type === FieldTypeEnum.TEXTAREA) {
          return f.required
            ? `  ${f.name}: z.string().nonempty("${f.label} is required")`
            : `  ${f.name}: z.string().optional()`;
        }

        if (f.type === FieldTypeEnum.SELECT) {
          return f.required
            ? `  ${f.name}: z.number().nonempty("${f.label} is required")`
            : `  ${f.name}: z.number().optional()`;
        }

        return f.required
          ? `  ${f.name}: z.string().nonempty("${f.label} is required")`
          : `  ${f.name}: z.string().optional()`;
      })
      .join(",\n");

    const jsxFields = fields
      .map((f) => {
        if (f.type === FieldTypeEnum.CHECKBOX) {
          return `
            <FormField
                control={form.control}
                name="${f.name}"
                render={({field}) => (
                  <FormItem>
                  <FormLabel>${f.label} ${
            f.required ? ` <span className="text-red-500">*</span>` : ""
          } </FormLabel>
                    {data
                      .map((item) =>
                        <div key={item.id} className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id="checkbox-{item.id}"
                            checked={field.value${
                              f.required ? "" : "?"
                            }.includes(item.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                checked
                                  ? [${
                                    f.required
                                      ? "...field.value"
                                      : "...(field?.value ?? [])"
                                  }, item.id]
                                  : field.value${
                                    f.required ? "" : "?"
                                  }.filter((id: number) => id !== item.id)
                              )
                            } />
                        </FormControl>
                        <label
                          htmlFor="checkbox-{item.id}"
                          className="cursor-pointer"
                        >
                          {item.name}
                        </label>
                      </div>
                      )}
                    <FormMessage />
                  </FormItem>
              )}
            />
          `;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType !== "password") {
          return `
        <FormField
          control={form.control}
          name="${f.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${f.label} ${
            f.required ? ` <span className="text-red-500">*</span>` : ""
          } </FormLabel>
              <FormControl>
                <Input placeholder="${f.label}..."
                  type="${f.formType ?? "text"}"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType === "password") {
          return `
              <FormField
                control={form.control}
                name="${f.name}"
                render={({ field }) => (
                  <FormItem className="gap-3">
                    <FormLabel>
                      ${f.label}${
            f.required ? ` <span className="text-red-500">*</span>` : ""
          }
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="off"
                        placeholder="${f.label}..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />`;
        }

        if (f.type === FieldTypeEnum.TEXTAREA) {
          return `
            <FormField
                    control={form.control}
                    name="${f.name}"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>${f.label} ${
            f.required ? ` <span className="text-red-500">*</span>` : ""
          } </FormLabel>
                        <FormControl>
                          <Textarea placeholder="${
                            f.label
                          }..."  className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
          `;
        }
        return "";
      })
      .join("\n");

    const importHeader = fields
      .filter(
        (field, index, self) =>
          index === self.findIndex((t) => t.type === field.type)
      )
      .map((f) => {
        if (f.type === FieldTypeEnum.CHECKBOX) {
          return `import { Checkbox } from "@/components/ui/checkbox";`;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType !== "password") {
          return `import { Input } from "@/components/ui/input";`;
        }

        if (f.type === FieldTypeEnum.TEXT && f.formType === "password") {
          return `import { PasswordInput } from "@/components/ui/password-input";`;
        }
        if (f.type === FieldTypeEnum.TEXTAREA) {
          return `import { Textarea } from "@/components/ui/textarea";`;
        }
      })
      .join("\n");

    const defaultValues = fields
      .map((f) => {
        if (f.type === FieldTypeEnum.CHECKBOX) {
          return `    ${f.name}: []`;
        }

        if (f.type === FieldTypeEnum.SELECT) {
          return `    ${f.name}: undefined`;
        }

        if (f.type === FieldTypeEnum.NUMBER) {
          return `    ${f.name}: undefined`;
        }

        return `    ${f.name}: ""`;
      })
      .join(",\n");

    return `
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

${importHeader}

const formSchema = z.object({
${zodSchema}
})

const data: { id: number; name: string }[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

export function MyGeneratedForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    ${defaultValues}
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex gap-6">
      {/* --- LEFT PANEL: BUILDER --- */}
      <div className="w-1/3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {componentList.map((component) => (
                <Button
                  key={component.type}
                  size="sm"
                  onClick={() => addField(component.type)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {component.label}
                </Button>
              ))}
            </div>

            <div className="space-y-3 mt-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className="p-4 border rounded-lg bg-white shadow-sm space-y-3 relative group"
                >
                  <h1 className="capitalize">{field.type}</h1>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                      onClick={() => removeField(field.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Label
                      </Label>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, { label: e.target.value })
                        }
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Database key
                      </Label>
                      <Input
                        value={field.name}
                        onChange={(e) =>
                          updateField(field.id, { name: e.target.value })
                        }
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`req-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(c) =>
                          updateField(field.id, { required: c })
                        }
                      />
                      <Label htmlFor={`req-${field.id}`} className="text-sm">
                        Required Field
                      </Label>
                    </div>

                    {field.type === FieldTypeEnum.TEXT && (
                      <div className="">
                        <Label className="mb-3">Input Type</Label>
                        <Select
                          value={field.formType}
                          onValueChange={(newType: string) =>
                            updateField(field.id, {
                              formType: newType as HTMLInputTypeAttribute,
                              validation: {
                                ...field.validation,
                                isEmail: newType === "email",
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="password">Password</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {(field.formType === "number" ||
                    field.formType === "password") && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        Validation Rules
                      </h4>

                      {/* Number Specific */}
                      {field.formType === "number" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label className="text-xs">Min Value</Label>
                            <Input
                              type="number"
                              onChange={(e) =>
                                handleValidationChange(
                                  "min",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label className="text-xs">Max Value</Label>
                            <Input
                              type="number"
                              onChange={(e) =>
                                handleValidationChange(
                                  "max",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* Password / Text Specific */}
                      {field.formType === "password" && (
                        <>
                          <div className="grid gap-2">
                            <Label className="text-xs">Min Length</Label>
                            <Input
                              type="number"
                              value={field.validation?.min || ""}
                              placeholder="e.g. 0"
                              onChange={(e) =>
                                handleValidationChange(
                                  "min",
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </div>

                          {field.formType === "password" && (
                            <div className="space-y-3 border rounded-md p-3">
                              <Label className="text-xs font-semibold">
                                Password Complexity
                              </Label>
                              <div className="flex flex-col gap-2">
                                {Object.values(PASSWORD_RULES).map((rule) => (
                                  <div
                                    key={rule.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={rule.id}
                                      checked={field.validation?.patterns?.includes(
                                        rule.id
                                      )}
                                      onCheckedChange={(checked) =>
                                        handlePatternToggle(
                                          rule.id,
                                          checked as boolean
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={rule.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {rule.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- RIGHT PANEL: PREVIEW / CODE --- */}
      <div className="w-2/3">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex space-x-2 bg-muted p-1 rounded-md">
              <Button
                variant={activeTab === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="w-4 h-4 mr-2" /> Preview
              </Button>
              <Button
                variant={activeTab === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("code")}
              >
                <Code className="w-4 h-4 mr-2" /> Code
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6 bg-white overflow-auto">
            {activeTab === "preview" ? (
              <div className="max-w-md mx-auto space-y-6 border p-8 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
                {/* Note: This is a visual simulation. In a real app, use React Hook Form here too */}
                {fields.map((f) => (
                  <div
                    key={f.id}
                    className="grid w-full items-center gap-1.5 mb-5"
                  >
                    <Label htmlFor={f.name} className="mb-2">
                      {f.label}{" "}
                      {f.required && <span className="text-red-500">*</span>}
                    </Label>
                    {f.type === FieldTypeEnum.TEXT && (
                      <Input id={f.name} placeholder={f.label} />
                    )}
                    {f.type === FieldTypeEnum.TEXTAREA && (
                      <Textarea id={f.name} placeholder={f.label} />
                    )}
                    {f.type === FieldTypeEnum.CHECKBOX && (
                      <div className="space-y-5">
                        {data.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 "
                          >
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
                  </div>
                ))}
                <Button className="w-full">Submit</Button>
              </div>
            ) : (
              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm overflow-auto font-mono h-[600px]">
                  {generateCode()}
                </pre>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
