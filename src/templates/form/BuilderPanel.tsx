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
        isMulti: false,
        styleType: type === "COMBOBOX" ? "base-ui" : "radix-ui",
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
      prev.map((field) => (field.id === id ? { ...field, ...updates } : field)),
    );
  };

  const handleValidationChange = (key: string, value: unknown) => {
    if (!selectedField) return;
    updateField(selectedField.id, {
      validation: {
        ...selectedField.validation,
        [key]: value,
      },
    });
  };

  const handlePatternToggle = (ruleKey: string, checked: boolean) => {
    if (!selectedField) return;
    const currentPatterns = selectedField.validation?.patterns || [];
    let newPatterns;

    if (checked) {
      // Add key if not present
      newPatterns = [...currentPatterns, ruleKey];
    } else {
      // Remove key
      newPatterns = currentPatterns.filter((p) => p !== ruleKey);
    }

    updateField(selectedField.id, {
      validation: { ...selectedField.validation, patterns: newPatterns },
    });
  };

  return (
    <div className="h-full flex flex-col space-y-5">
      {/* Add Components Section - Compact */}
      <Card className="gap-3">
        <CardHeader className="gap-0">
          <CardTitle className="text-base ">Add Field</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-1.5">
            {componentList.map((component) => (
              <Button
                key={component.type}
                size="sm"
                variant="outline"
                onClick={() => addField(component.type)}
                className="h-8 text-xs justify-start"
                title={component.label}
              >
                <Plus className="w-3 h-3 mr-1.5" />
                {component.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fields List and Settings - Side by Side Layout */}
      <div className="flex-1 flex gap-3 min-h-0 -mt-1 flex-row-reverse">
        {/* Fields List - Left Side */}
        <Card
          className={`flex flex-col min-h-0 gap-3 ${selectedField ? "w-1/2" : "w-full"}`}
        >
          <CardHeader className="pb-2 shrink-0 gap-0">
            <CardTitle className="text-base">
              Fields ({fields.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto space-y-1.5 pt-0">
            {fields.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                No fields yet. Add a field to get started.
              </div>
            ) : (
              fields.map((field) => (
                <div
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className={`p-2.5 border rounded-md cursor-pointer transition-colors relative group ${
                    selectedField?.id === field.id
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {field.label || "Unnamed"}
                        </span>
                        {field.required && (
                          <span className="text-red-500 text-xs">*</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground capitalize">
                          {field.type.toLowerCase()} {field.styleType}
                        </span>
                        {field.formType && field.formType !== "text" && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {field.formType}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Selected Field Details - Right Side */}
        {selectedField && (
          <Card className="w-1/2 flex flex-col min-h-0 gap-3">
            <CardHeader className="pb-2 shrink-0 gap-0">
              <CardTitle className="text-base">Field Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Label
                  </Label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) =>
                      updateField(selectedField.id, { label: e.target.value })
                    }
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Database key
                  </Label>
                  <Input
                    value={selectedField.name}
                    onChange={(e) =>
                      updateField(selectedField.id, { name: e.target.value })
                    }
                    className="h-8 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`req-${selectedField.id}`}
                  checked={selectedField.required}
                  onCheckedChange={(c) =>
                    updateField(selectedField.id, { required: c })
                  }
                />
                <Label htmlFor={`req-${selectedField.id}`} className="text-sm">
                  Required Field
                </Label>
              </div>

              {selectedField.type === "COMBOBOX" && (
                <>
                  {selectedField.styleType === "base-ui" && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`req-${selectedField.id}`}
                        checked={selectedField.isMulti}
                        onCheckedChange={(c) =>
                          updateField(selectedField.id, { isMulti: c })
                        }
                      />
                      <Label
                        htmlFor={`req-${selectedField.id}`}
                        className="text-sm"
                      >
                        Multi
                      </Label>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Combobox Type
                    </Label>
                    <Select
                      value={selectedField.styleType ?? "radix-ui"}
                      onValueChange={(value: "base-ui" | "radix-ui") =>
                        updateField(selectedField.id, { styleType: value })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base-ui">Base UI</SelectItem>
                        <SelectItem value="radix-ui">Radix UI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedField.type === FieldTypeEnum.TEXT && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Input Type
                  </Label>
                  <Select
                    value={selectedField.formType}
                    onValueChange={(newType: string) =>
                      updateField(selectedField.id, {
                        formType: newType as HTMLInputTypeAttribute,
                        validation: {
                          ...selectedField.validation,
                          isEmail: newType === "email",
                        },
                      })
                    }
                  >
                    <SelectTrigger className="h-8">
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

              {(selectedField.formType === "number" ||
                selectedField.formType === "password") && (
                <div className="space-y-3 border-t pt-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Validation Rules
                  </h4>

                  {/* Number Specific */}
                  {selectedField.formType === "number" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs mb-1.5 block">
                          Min Value
                        </Label>
                        <Input
                          type="number"
                          className="h-8"
                          value={selectedField.validation?.min || ""}
                          placeholder="Min"
                          onChange={(e) =>
                            handleValidationChange(
                              "min",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1.5 block">
                          Max Value
                        </Label>
                        <Input
                          type="number"
                          className="h-8"
                          value={selectedField.validation?.max || ""}
                          placeholder="Max"
                          onChange={(e) =>
                            handleValidationChange(
                              "max",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Specific */}
                  {selectedField.formType === "password" && (
                    <>
                      <div>
                        <Label className="text-xs mb-1.5 block">
                          Min Length
                        </Label>
                        <Input
                          type="number"
                          className="h-8"
                          value={selectedField.validation?.min || ""}
                          placeholder="e.g. 8"
                          onChange={(e) =>
                            handleValidationChange(
                              "min",
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2 border rounded-md p-3">
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
                                id={`${selectedField.id}-${rule.id}`}
                                checked={selectedField.validation?.patterns?.includes(
                                  rule.id,
                                )}
                                onCheckedChange={(checked) =>
                                  handlePatternToggle(
                                    rule.id,
                                    checked as boolean,
                                  )
                                }
                              />
                              <label
                                htmlFor={`${selectedField.id}-${rule.id}`}
                                className="text-xs font-medium leading-none cursor-pointer"
                              >
                                {rule.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BuilderPanel;
