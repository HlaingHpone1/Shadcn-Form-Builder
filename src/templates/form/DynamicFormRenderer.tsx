"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerInput } from "@/components/date-picker";
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
import {
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
import { FieldTypeEnum, PASSWORD_RULES, PasswordRuleKey } from "@/constants";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils";

type Item = { id: number; name: string };
const data: Item[] = [
  { id: 1, name: "Option 1" },
  { id: 2, name: "Option 2" },
  { id: 3, name: "Option 3" },
];

function generateZodSchema(fields: FormField[]) {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    const requiredMessage = `${field.label} is required`;

    switch (field.type) {
      case FieldTypeEnum.TEXT:
        switch (field.formType) {
          case "text":
            schemaObject[field.name] = field.required
              ? z.string().min(1, requiredMessage)
              : z.string().optional();
            break;
          case "email":
            schemaObject[field.name] = field.required
              ? z.string().email(requiredMessage).or(z.literal(""))
              : z.string().email().optional().or(z.literal(""));
            break;
          case "password":
            let passwordSchema = z.string();
            if (field.validation?.min) {
              passwordSchema = passwordSchema.min(
                field.validation.min,
                `${field.label} must be at least ${field.validation.min} characters`,
              );
            }
            if (field.validation?.patterns) {
              field.validation.patterns.forEach((key) => {
                const rule = PASSWORD_RULES[key as PasswordRuleKey];
                if (rule) {
                  passwordSchema = passwordSchema.regex(
                    rule.regex,
                    rule.message,
                  );
                }
              });
            }
            schemaObject[field.name] = field.required
              ? passwordSchema.min(1, requiredMessage)
              : passwordSchema.optional();
            break;
          default:
            schemaObject[field.name] = field.required
              ? z.string().min(1, requiredMessage)
              : z.string().optional();
        }
        break;

      case FieldTypeEnum.DATEPICKER:
        schemaObject[field.name] = field.required
          ? z.string().min(1, requiredMessage)
          : z.string().optional();
        break;

      case FieldTypeEnum.CHECKBOX:
        schemaObject[field.name] = field.required
          ? z.array(z.number()).min(1, requiredMessage)
          : z.array(z.number()).optional();
        break;

      case FieldTypeEnum.RADIO:
        schemaObject[field.name] = field.required
          ? z.string().min(1, requiredMessage)
          : z.string().optional();
        break;

      case FieldTypeEnum.SELECT:
        if (field.required) {
          schemaObject[field.name] = z.preprocess(
            (val) => {
              if (val === undefined || val === null || val === "") {
                return undefined;
              }
              const num = Number(val);
              return isNaN(num) ? undefined : num;
            },
            z
              .union([z.number(), z.undefined()])
              .refine((val) => val !== undefined, {
                message: requiredMessage,
              }),
          );
        } else {
          schemaObject[field.name] = z.preprocess((val) => {
            if (val === undefined || val === null || val === "") {
              return undefined;
            }
            const num = Number(val);
            return isNaN(num) ? undefined : num;
          }, z.number().optional());
        }
        break;

      case FieldTypeEnum.COMBOBOX:
        if (field.isMulti) {
          schemaObject[field.name] = field.required
            ? z.array(z.string()).min(1, requiredMessage)
            : z.array(z.string()).optional();
        } else {
          schemaObject[field.name] = field.required
            ? z.string().min(1, requiredMessage)
            : z.string().optional();
        }
        break;

      case FieldTypeEnum.TEXTAREA:
        schemaObject[field.name] = field.required
          ? z.string().min(1, requiredMessage)
          : z.string().optional();
        break;

      default:
        schemaObject[field.name] = field.required
          ? z.string().min(1, requiredMessage)
          : z.string().optional();
    }
  });

  return z.object(schemaObject);
}

type DefaultValue = string | number[] | string[] | undefined;

function generateDefaultValues(
  fields: FormField[],
): Record<string, DefaultValue> {
  const defaults: Record<string, DefaultValue> = {};
  fields.forEach((f) => {
    if (f.type === FieldTypeEnum.CHECKBOX) {
      defaults[f.name] = [];
    } else if (f.type === FieldTypeEnum.RADIO) {
      defaults[f.name] = "";
    } else if (
      f.type === FieldTypeEnum.SELECT ||
      f.type === FieldTypeEnum.NUMBER
    ) {
      defaults[f.name] = undefined;
    } else if (f.type === FieldTypeEnum.COMBOBOX && f.isMulti) {
      defaults[f.name] = [];
    } else {
      defaults[f.name] = "";
    }
  });
  return defaults;
}

interface DynamicFormRendererProps {
  fields: FormField[];
}

export function DynamicFormRenderer({ fields }: DynamicFormRendererProps) {
  const schema = generateZodSchema(fields);
  const defaultValues = generateDefaultValues(fields);
  const anchorRef = useComboboxAnchor();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  if (fields.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="text-sm">No fields found in session storage.</p>
        <p className="text-xs mt-1">Go to the form builder to create fields.</p>
      </div>
    );
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((f) => {
          switch (f.type) {
            case FieldTypeEnum.TEXT:
              if (f.formType === "password") {
                return (
                  <FormField
                    key={f.id}
                    control={form.control}
                    name={f.name}
                    render={({ field }) => (
                      <FormItem className="gap-3">
                        <FormLabel>
                          {f.label}
                          {f.required && (
                            <span className="text-red-500"> *</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="off"
                            placeholder={`${f.label}...`}
                            value={(field.value as string) ?? ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`${f.label}...`}
                          type={f.formType ?? "text"}
                          value={(field.value as string) ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            case FieldTypeEnum.TEXTAREA:
              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`${f.label}...`}
                          className="resize-none"
                          value={(field.value as string) ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            case FieldTypeEnum.CHECKBOX:
              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </FormLabel>
                      {data.map((item) => {
                        const value = (field.value as number[]) ?? [];
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                id={`checkbox-${item.id}`}
                                checked={value.includes(item.id)}
                                onCheckedChange={(checked) =>
                                  field.onChange(
                                    checked
                                      ? [...value, item.id]
                                      : value.filter(
                                          (id: number) => id !== item.id,
                                        ),
                                  )
                                }
                              />
                            </FormControl>
                            <label
                              htmlFor={`checkbox-${item.id}`}
                              className="cursor-pointer text-sm"
                            >
                              {item.name}
                            </label>
                          </div>
                        );
                      })}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            case FieldTypeEnum.RADIO:
              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={(field.value as string) ?? ""}
                        >
                          {data.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2"
                            >
                              <RadioGroupItem
                                value={item.id.toString()}
                                id={`radio-${item.id}`}
                              />
                              <label
                                htmlFor={`radio-${item.id}`}
                                className="cursor-pointer text-sm"
                              >
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            case FieldTypeEnum.SELECT:
              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value ? Number(value) : undefined);
                        }}
                        value={
                          field.value !== undefined && field.value !== null
                            ? String(field.value)
                            : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`${f.label}...`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent align="start" position="popper">
                          {data.map((item) => (
                            <SelectItem
                              value={item.id.toString()}
                              key={item.id}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );

            case FieldTypeEnum.DATEPICKER:
              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => {
                    const value = field.value as string | undefined;
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          {f.label}
                          {f.required && (
                            <span className="text-red-500"> *</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <DatePickerInput
                            value={value ? new Date(value) : undefined}
                            onChange={(date) =>
                              field.onChange(
                                date ? date.toISOString() : undefined,
                              )
                            }
                            placeholder={`${f.label}...`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              );

            case FieldTypeEnum.COMBOBOX:
              if (f.isMulti) {
                return (
                  <FormField
                    key={f.id}
                    control={form.control}
                    name={f.name}
                    render={({ field }) => {
                      const value = (field.value as string[]) ?? [];
                      const selectedItems = data.filter((item) =>
                        value.includes(item.id.toString()),
                      );

                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            {f.label}
                            {f.required && (
                              <span className="text-red-500"> *</span>
                            )}
                          </FormLabel>
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
                                      <ComboboxChip
                                        key={item.id}
                                        className="max-w-fit"
                                      >
                                        {item.name}
                                      </ComboboxChip>
                                    ))}
                                  </ComboboxValue>
                                  <ComboboxChipsInput
                                    className="flex-1 min-w-30"
                                    placeholder={`${f.label}...`}
                                  />
                                </ComboboxChips>
                                <ComboboxContent
                                  anchor={anchorRef}
                                  align="start"
                                >
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
                );
              }

              const comboboxType = f.styleType ?? "base-ui";
              const isRadix = comboboxType === "radix-ui";

              if (isRadix) {
                return (
                  <FormField
                    key={f.id}
                    control={form.control}
                    name={f.name}
                    render={({ field }) => {
                      const value = field.value as string | undefined;
                      const selectedItem = data.find(
                        (item) => item.id.toString() === value,
                      );

                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            {f.label}
                            {f.required && (
                              <span className="text-red-500"> *</span>
                            )}
                          </FormLabel>
                          <Popover modal>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  type="button"
                                  className={cn(
                                    "h-9 w-full justify-between truncate",
                                    !value && "text-muted-foreground",
                                  )}
                                >
                                  {value ? selectedItem?.name : f.label}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Search..." />
                                <CommandList>
                                  <CommandEmpty>No items found.</CommandEmpty>
                                  <CommandGroup>
                                    {data.map((item) => (
                                      <CommandItem
                                        value={item.id.toString()}
                                        key={item.id}
                                        onSelect={() => {
                                          if (item.id.toString() === value) {
                                            field.onChange(undefined);
                                          } else {
                                            field.onChange(item.id.toString());
                                          }
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            item.id.toString() === value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {item.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                );
              }

              return (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={f.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          items={data}
                          itemToStringValue={(item) => item.id.toString()}
                          itemToStringLabel={(item: Item) => item.name}
                          onValueChange={(value) =>
                            field.onChange(
                              value ? value.id.toString() : undefined,
                            )
                          }
                        >
                          <ComboboxInput
                            placeholder={f.label}
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
              );

            default:
              return null;
          }
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
