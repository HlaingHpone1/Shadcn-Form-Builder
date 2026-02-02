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
  // If true, requires ctrlKey on Mac (Control key) or altKey on Windows/Linux (Alt key)
  controlOrAlt?: boolean;
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
  
  // Field actions
  toggleRequired: (id: string) => void;
  clearAllFields: () => void;
  
  // Command palette
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Search focus
  focusFieldSearch: () => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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
    toggleRequired,
    clearAllFields,
    setCommandPaletteOpen,
    focusFieldSearch,
    undo,
    redo,
    canUndo,
    canRedo,
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
    // Quick field creation shortcuts (Ctrl/Cmd + Control on Mac, Ctrl/Cmd + Alt on Windows/Linux)
    // Ctrl/Cmd + Control (Mac) / Alt (Windows/Linux) + I → Add Text field
    {
      key: "i",
      ctrlOrCmd: true,
      altOrOption: true,
      action: () => {
        quickAddField(FieldTypeEnum.TEXT);
        toast.success("Text field added");
      },
    },
    // Ctrl/Cmd + Control (Mac) / Alt (Windows/Linux) + A → Add Textarea field
    {
      key: "a",
      ctrlOrCmd: true,
      controlOrAlt: true,
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
    // Ctrl/Cmd + Control (Mac) / Alt (Windows/Linux) + R → Add Radio field
    {
      key: "r",
      ctrlOrCmd: true,
      controlOrAlt: true,
      action: () => {
        quickAddField(FieldTypeEnum.RADIO);
        toast.success("Radio field added");
      },
    },
    // Ctrl/Cmd + Control (Mac) / Alt (Windows/Linux) + O → Add Combobox field
    {
      key: "o",
      ctrlOrCmd: true,
      controlOrAlt: true,
      action: () => {
        quickAddField(FieldTypeEnum.COMBOBOX);
        toast.success("Combobox field added");
      },
    },
    // Ctrl/Cmd + Control (Mac) / Alt (Windows/Linux) + Y → Add Datepicker field
    {
      key: "y",
      ctrlOrCmd: true,
      controlOrAlt: true,
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
    // Toggle required: Ctrl/Cmd + Shift + R
    {
      key: "r",
      ctrlOrCmd: true,
      shiftKey: true,
      action: () => {
        if (selectedFieldId) {
          toggleRequired(selectedFieldId);
          toast.success("Required status toggled");
        }
      },
      condition: () => !!selectedFieldId,
    },
    // Clear all fields: Ctrl/Cmd + Shift + Delete
    {
      key: "Delete",
      ctrlOrCmd: true,
      shiftKey: true,
      action: () => {
        clearAllFields();
      },
    },
    // Command palette: Ctrl/Cmd + K
    {
      key: "k",
      ctrlOrCmd: true,
      action: () => {
        setCommandPaletteOpen(true);
      },
    },
    // Focus search: Ctrl/Cmd + F
    {
      key: "f",
      ctrlOrCmd: true,
      action: () => {
        focusFieldSearch();
      },
      condition: () => fields.length > 0,
    },
    // Undo: Ctrl/Cmd + Z
    {
      key: "z",
      ctrlOrCmd: true,
      shiftKey: false,
      action: () => {
        if (canUndo) {
          undo();
          toast.success("Undone");
        }
      },
      condition: () => canUndo,
    },
    // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    {
      key: "z",
      ctrlOrCmd: true,
      shiftKey: true,
      action: () => {
        if (canRedo) {
          redo();
          toast.success("Redone");
        }
      },
      condition: () => canRedo,
    },
    {
      key: "y",
      ctrlOrCmd: true,
      action: () => {
        if (canRedo) {
          redo();
          toast.success("Redone");
        }
      },
      condition: () => canRedo && activeTab !== "code", // Avoid conflict with browser redo
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
