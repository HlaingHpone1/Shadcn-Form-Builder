import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { componentList, FieldTypeEnum, PASSWORD_RULES } from "@/constants";
import { Plus, Trash2 } from "lucide-react";
import React, { Dispatch, HTMLInputTypeAttribute, SetStateAction } from "react";

interface BuilderPanelProps {
  fields: FormField[];
  setFields: Dispatch<SetStateAction<FormField[]>>;
  selectedField: FormField | null;
  setSelectedFieldId: Dispatch<SetStateAction<string | null>>;
}

const BuilderPanel = ({
  fields,
  setFields,
  selectedField,
  setSelectedFieldId,
}: BuilderPanelProps) => {
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

    updateField(selectedField!.id, {
      validation: { ...selectedField?.validation, patterns: newPatterns },
    });
  };

  return (
    <div className="w-1/3 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Form Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1>Component List</h1>
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
                      Label (
                      <h1 className="capitalize text-xs">{field.type}</h1>)
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
  );
};

export default BuilderPanel;
