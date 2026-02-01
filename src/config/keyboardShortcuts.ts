import { toast } from "sonner";
import { FieldTypeEnum } from "@/constants";
import type { HTMLInputTypeAttribute } from "react";

interface KeyboardShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlOrCmd?: boolean;
  altOrOption?: boolean;
  action: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
  condition?: (e: KeyboardEvent) => boolean;
}

interface KeyboardShortcutsParams {
  // Tab management
  setActiveTab: (tab: "preview" | "code") => void;
  activeTab: "preview" | "code";
  
  // Code copying
  handleCopyCode: () => void;
  
  // Field management
  selectedFieldId: string | null;
  fields: FormField[];
  duplicateField: (id: string) => void;
  deleteSelectedField: () => void;
  setSelectedFieldId: (id: string | null) => void;
  selectNextField: () => void;
  selectPreviousField: () => void;
  moveFieldUp: (id: string) => void;
  moveFieldDown: (id: string) => void;
  
  // Dialog
  setShortcutsDialogOpen: (open: boolean) => void;
  
  // Quick field creation
  quickAddField: (type: FieldType, formType?: HTMLInputTypeAttribute) => void;
}

export function createKeyboardShortcuts(
  params: KeyboardShortcutsParams
): KeyboardShortcutConfig[] {
  const {
    setActiveTab,
    activeTab,
    handleCopyCode,
    selectedFieldId,
    fields,
    duplicateField,
    deleteSelectedField,
    setSelectedFieldId,
    selectNextField,
    selectPreviousField,
    moveFieldUp,
    moveFieldDown,
    setShortcutsDialogOpen,
    quickAddField,
  } = params;

  return [
    // Tab switching: Ctrl/Cmd + 1 (Preview) or Ctrl/Cmd + 2 (Code)
    {
      key: "1",
      ctrlOrCmd: true,
      action: () => setActiveTab("preview"),
    },
    {
      key: "2",
      ctrlOrCmd: true,
      action: () => setActiveTab("code"),
    },
    // Quick field creation shortcuts (Ctrl/Cmd + Alt/Option)
    // Ctrl/Cmd + Alt/Option + I → Add Text field
    {
      key: "i",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.TEXT);
        toast.success("Text field added");
      },
    },
    // Ctrl/Cmd + Alt/Option + A → Add Textarea field
    {
      key: "a",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.TEXTAREA);
        toast.success("Textarea field added");
      },
    },
    // Ctrl/Cmd + Alt + E → Add Email field (TEXT with email formType)
    {
      key: "e",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.TEXT, "email");
        toast.success("Email field added");
      },
    },
    // Ctrl/Cmd + Alt + P → Add Password field (TEXT with password formType)
    {
      key: "p",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.TEXT, "password");
        toast.success("Password field added");
      },
    },
    // Ctrl/Cmd + Alt + N → Add Number field
    {
      key: "n",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.NUMBER);
        toast.success("Number field added");
      },
    },
    // Ctrl/Cmd + Alt + S → Add Select field
    {
      key: "s",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.SELECT);
        toast.success("Select field added");
      },
    },
    // Ctrl/Cmd + Alt + C → Add Checkbox field (only when NOT on code tab to avoid copy conflict)
    {
      key: "c",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.CHECKBOX);
        toast.success("Checkbox field added");
      },
    },
    // Copy code: Ctrl/Cmd + C (only in code tab, no text selected) - placed after checkbox to avoid conflict
    {
      key: "c",
      ctrlOrCmd: true,
      altKey: false,
      action: handleCopyCode,
      condition: () => {
        return (
          activeTab === "code" && !window.getSelection()?.toString()
        );
      },
    },
    // Ctrl/Cmd + Alt + R → Add Radio field
    {
      key: "r",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.RADIO);
        toast.success("Radio field added");
      },
    },
    // Ctrl/Cmd + Alt/Option + O → Add Combobox field
    {
      key: "o",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.COMBOBOX);
        toast.success("Combobox field added");
      },
    },
    // Ctrl/Cmd + Alt/Option + Y → Add Datepicker field
    {
      key: "y",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.DATEPICKER);
        toast.success("Datepicker field added");
      },
    },
    // Duplicate field: Ctrl/Cmd + D
    {
      key: "d",
      ctrlOrCmd: true,
      action: () => {
        if (selectedFieldId) {
          duplicateField(selectedFieldId);
          toast.success("Field duplicated");
        }
      },
      condition: () => !!selectedFieldId,
    },
    // Delete field: Delete or Backspace
    {
      key: "Delete",
      action: () => {
        if (selectedFieldId) {
          deleteSelectedField();
          toast.success("Field deleted");
        }
      },
      condition: () => !!selectedFieldId,
    },
    {
      key: "Backspace",
      action: () => {
        if (selectedFieldId) {
          deleteSelectedField();
          toast.success("Field deleted");
        }
      },
      condition: () => !!selectedFieldId,
    },
    // Deselect field: Escape
    {
      key: "Escape",
      action: () => {
        if (selectedFieldId) {
          setSelectedFieldId(null);
        }
      },
      condition: () => !!selectedFieldId,
    },
    // Open keyboard shortcuts dialog: Ctrl/Cmd + / or Ctrl/Cmd + ? (Shift + /)
    {
      key: "/",
      ctrlOrCmd: true,
      action: () => setShortcutsDialogOpen(true),
    },
    {
      key: "?",
      ctrlOrCmd: true,
      shiftKey: true,
      action: () => setShortcutsDialogOpen(true),
    },
    // Move field up/down: Ctrl/Cmd + Arrow Up/Down (check first - more specific)
    {
      key: "ArrowUp",
      ctrlOrCmd: true,
      action: () => {
        if (selectedFieldId) {
          moveFieldUp(selectedFieldId);
          toast.success("Field moved up");
        }
      },
      condition: () => !!selectedFieldId && fields.length > 0,
    },
    {
      key: "ArrowDown",
      ctrlOrCmd: true,
      action: () => {
        if (selectedFieldId) {
          moveFieldDown(selectedFieldId);
          toast.success("Field moved down");
        }
      },
      condition: () => !!selectedFieldId && fields.length > 0,
    },
    // Field navigation: Arrow Up/Down (check after modifiers - less specific)
    {
      key: "ArrowUp",
      action: () => {
        selectPreviousField();
      },
      condition: () => fields.length > 0,
    },
    {
      key: "ArrowDown",
      action: () => {
        selectNextField();
      },
      condition: () => fields.length > 0,
    },
  ];
}
