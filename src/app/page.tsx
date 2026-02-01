"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Code, Eye, Copy, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BuilderPanel from "@/templates/form/BuilderPanel";
import PreviewTab from "@/templates/form/PreviewTab";
import { generateCode } from "@/templates/form/generators/FormGenerator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormStore } from "@/store/formStore";
import { useUIStore } from "@/store/uiStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { createKeyboardShortcuts } from "@/config/keyboardShortcuts";
import { CommandPalette } from "@/components/CommandPalette";

export default function FormBuilder() {
  const fields = useFormStore((state) => state.fields);
  const selectedFieldId = useFormStore((state) => state.selectedFieldId);
  const hasHydrated = useFormStore((state) => state.hasHydrated);
  const setHasHydrated = useFormStore((state) => state.setHasHydrated);
  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);
  const componentInfo = useUIStore((state) => state.componentInfo);
  const setComponentInfo = useUIStore((state) => state.setComponentInfo);
  const hasShownInfo = useRef(false);
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = React.useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  // Form store actions
  const duplicateField = useFormStore((state) => state.duplicateField);
  const deleteSelectedField = useFormStore(
    (state) => state.deleteSelectedField,
  );
  const setSelectedFieldId = useFormStore((state) => state.setSelectedFieldId);
  const selectNextField = useFormStore((state) => state.selectNextField);
  const selectPreviousField = useFormStore(
    (state) => state.selectPreviousField,
  );
  const moveFieldUp = useFormStore((state) => state.moveFieldUp);
  const moveFieldDown = useFormStore((state) => state.moveFieldDown);
  const quickAddField = useFormStore((state) => state.quickAddField);
  const toggleRequired = useFormStore((state) => state.toggleRequired);
  const clearAllFields = useFormStore((state) => state.clearAllFields);
  const undo = useFormStore((state) => state.undo);
  const redo = useFormStore((state) => state.redo);
  const canUndo = useFormStore((state) => state.canUndo);
  const canRedo = useFormStore((state) => state.canRedo);

  const showZodInfo = useCallback(() => {
    toast.info("Form Builder Requirement", {
      description:
        "Zod version must be 4 or above for this form builder to work correctly.",
      duration: 5000,
    });
  }, []);

  const handleCopyCode = useCallback(async () => {
    try {
      const code = generateCode(fields, componentInfo);
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy code:", err);
      toast.error("Failed to copy code to clipboard");
    }
  }, [fields, componentInfo]);

  // Keyboard shortcuts configuration using map-based dispatch
  const shortcuts = React.useMemo(
    () =>
      createKeyboardShortcuts({
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
        focusFieldSearch: () => {
          const searchInput = document.querySelector(
            "[data-field-search-input]",
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        },
        undo,
        redo,
        canUndo,
        canRedo,
      }),
    [
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
      undo,
      redo,
      canUndo,
      canRedo,
    ],
  );

  useKeyboardShortcuts({
    shortcuts,
    enabled: hasHydrated,
    scope: "global",
  });

  useEffect(() => {
    if (!hasHydrated) {
      setHasHydrated(true);
    }
  }, [hasHydrated, setHasHydrated]);

  // Show zod requirement info on first load
  useEffect(() => {
    if (hasHydrated && !hasShownInfo.current) {
      hasShownInfo.current = true;
      showZodInfo();
    }
  }, [hasHydrated, showZodInfo]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading form builder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-card border-b shadow-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Form Builder</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={showZodInfo}
              className="h-8 w-8 p-0"
              title="Form Builder Info"
            >
              <Info className="w-4 h-4" />
            </Button>
            <KeyboardShortcutsDialog
              open={shortcutsDialogOpen}
              onOpenChange={setShortcutsDialogOpen}
            />
            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Component Info
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Component Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs mb-1.5 block">
                        Function Name
                      </Label>
                      <Input
                        value={componentInfo.functionName}
                        placeholder="Function Name"
                        onChange={(e) =>
                          setComponentInfo({
                            ...componentInfo,
                            functionName: e.target.value,
                          })
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1.5 block">
                        Schema Name
                      </Label>
                      <Input
                        value={componentInfo.schemaName}
                        placeholder="Schema Name"
                        onChange={(e) =>
                          setComponentInfo({
                            ...componentInfo,
                            schemaName: e.target.value,
                          })
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1.5 block">
                        Schema Type
                      </Label>
                      <Input
                        value={componentInfo.schemaType}
                        placeholder="Schema Type"
                        onChange={(e) =>
                          setComponentInfo({
                            ...componentInfo,
                            schemaType: e.target.value,
                          })
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex space-x-1 bg-muted p-1 rounded-md">
              <Button
                variant={activeTab === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("preview")}
                className="h-8 px-3"
              >
                <Eye className="w-4 h-4 mr-1.5" /> Preview
              </Button>
              <Button
                variant={activeTab === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("code")}
                className="h-8 px-3"
              >
                <Code className="w-4 h-4 mr-1.5" /> Code
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex Layout */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* --- LEFT PANEL: BUILDER --- */}
        <div className="flex-1 shrink-0">
          <BuilderPanel selectedField={selectedField} />
        </div>

        {/* --- RIGHT PANEL: PREVIEW / CODE --- */}
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 p-6 overflow-auto">
              {activeTab === "preview" ? (
                <PreviewTab fields={fields} />
              ) : (
                <div className="relative h-full">
                  <pre className="bg-card text-card-foreground border p-4 rounded-lg text-sm overflow-auto font-mono h-full">
                    {generateCode(fields, componentInfo)}
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={handleCopyCode}
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onQuickAddField={quickAddField}
      />
    </div>
  );
}
