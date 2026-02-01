"use client";

import React, { HTMLInputTypeAttribute, useCallback, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { useFormStore } from "@/store/formStore";
import { FieldTypeEnum } from "@/constants";
import {
  Text,
  Mail,
  Lock,
  Hash,
  List,
  CheckSquare,
  Circle,
  Calendar,
  Search,
  Trash2,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuickAddField: (type: FieldType, formType?: HTMLInputTypeAttribute) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onQuickAddField,
}: CommandPaletteProps) {
  const fields = useFormStore((state) => state.fields);
  const setSelectedFieldId = useFormStore((state) => state.setSelectedFieldId);
  const clearAllFields = useFormStore((state) => state.clearAllFields);

  const fieldCommands = useMemo(() => {
    return fields.map((field) => ({
      id: field.id,
      label: field.label || "Unnamed",
      name: field.name,
      type: field.type,
    }));
  }, [fields]);

  const handleSelectField = useCallback(
    (fieldId: string) => {
      setSelectedFieldId(fieldId);
      onOpenChange(false);
    },
    [setSelectedFieldId, onOpenChange],
  );

  const handleQuickAdd = useCallback(
    (type: FieldType, formType?: HTMLInputTypeAttribute) => {
      onQuickAddField(type, formType);
      onOpenChange(false);
    },
    [onQuickAddField, onOpenChange],
  );

  const handleClearAll = useCallback(() => {
    clearAllFields();
    onOpenChange(false);
  }, [clearAllFields, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search fields or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.TEXT)}>
            <Text className="mr-2 h-4 w-4" />
            <span>Add Text field</span>
            <CommandShortcut>⌘⌥I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.TEXTAREA)}>
            <Text className="mr-2 h-4 w-4" />
            <span>Add Textarea field</span>
            <CommandShortcut>⌘⌥A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.SELECT)}>
            <List className="mr-2 h-4 w-4" />
            <span>Add Select field</span>
            <CommandShortcut>⌘⌥S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.CHECKBOX)}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Add Checkbox field</span>
            <CommandShortcut>⌘⌥C</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.RADIO)}>
            <Circle className="mr-2 h-4 w-4" />
            <span>Add Radio field</span>
            <CommandShortcut>⌘⌥R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.NUMBER)}>
            <Hash className="mr-2 h-4 w-4" />
            <span>Add Number field</span>
            <CommandShortcut>⌘⌥N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleQuickAdd(FieldTypeEnum.DATEPICKER)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Add Datepicker field</span>
            <CommandShortcut>⌘⌥Y</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickAdd(FieldTypeEnum.COMBOBOX)}>
            <Search className="mr-2 h-4 w-4" />
            <span>Add Combobox field</span>
            <CommandShortcut>⌘⌥O</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleQuickAdd(FieldTypeEnum.TEXT, "email")}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Add Email field</span>
            <CommandShortcut>⌘⌥E</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => handleQuickAdd(FieldTypeEnum.TEXT, "password")}
          >
            <Lock className="mr-2 h-4 w-4" />
            <span>Add Password field</span>
            <CommandShortcut>⌘⌥P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {fieldCommands.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Fields">
              {fieldCommands.map((field) => (
                <CommandItem
                  key={field.id}
                  onSelect={() => handleSelectField(field.id)}
                  value={`${field.label} ${field.name} ${field.type}`}
                >
                  <span>{field.label || "Unnamed"}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({field.type})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {fields.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Danger Zone">
              <CommandItem onSelect={handleClearAll}>
                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                <span className="text-destructive">Clear all fields</span>
                <CommandShortcut>⌘⇧⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
