"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { HTMLInputTypeAttribute, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormField {
  id: string;
  className?: string;
  name: string;
  placeholder?: string;
  type: FormType;
  formType: HTMLInputTypeAttribute;
}

type FormType = "INPUT" | "TEXTAREA" | "SELECT";
interface ComponentItem {
  type: FormType;
  label: string;
  formType: HTMLInputTypeAttribute;
}

const componentList: ComponentItem[] = [
  {
    type: "INPUT",
    label: "Input",
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
];

const loginSchema = z.object({
  email: z.string().email("Email is Required"),
  textarea: z.string(),
  password: z.string().trim().nonempty("ddd"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export default function Home() {
  const [fieldList, setFieldList] = useState<FormField[]>([]);

  const handleAddField = (component: ComponentItem) => {
    const uniqueId = crypto.randomUUID();

    const newField: FormField = {
      id: uniqueId,
      name: `name_${uniqueId}`,
      placeholder: `Enter Your ${component.label}`,
      type: component.type,
      formType: component.formType,
    };
    setFieldList((prev) => [...prev, newField]);
  };

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginForm) {}

  return (
    <>
      <div className="grid grid-cols-[200px_1fr_1fr] gap-5 p-10">
        <div className="flex flex-col gap-5">
          {componentList.map((component) => (
            <Button
              key={component.type}
              onClick={() => handleAddField(component)}
            >
              {component.label}
            </Button>
          ))}
        </div>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fieldList.map((field) =>
                field.type === "INPUT" ? (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.name}
                    render={({ field }) => (
                      <FormItem className="gap-3">
                        <Label> {field.name} </Label>
                        <FormControl>
                          <Input placeholder="sample@sample.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : field.type === "TEXTAREA" ? (
                  <FormField
                    control={form.control}
                    name={field.name}
                    render={({ field }) => (
                      <FormItem>
                        <Label> {field.name} </Label>
                        <FormControl>
                          <Textarea className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null
              )}
            </form>
          </Form>
        </div>
        <div className="">Generate Code</div>
      </div>
    </>
  );
}
