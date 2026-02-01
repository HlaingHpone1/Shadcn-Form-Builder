"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface Shortcut {
  category: string;
  shortcuts: {
    description: string;
    keys: string[];
    alternativeKeys?: string[];
  }[];
}

const keyboardShortcuts: Shortcut[] = [
  {
    category: "Navigation",
    shortcuts: [
      {
        description: "Switch to Preview tab",
        keys: ["Ctrl", "1"],
      },
      {
        description: "Switch to Code tab",
        keys: ["Ctrl", "2"],
      },
      {
        description: "Show keyboard shortcuts",
        keys: ["Ctrl", "?"],
      },
    ],
  },
  {
    category: "Code",
    shortcuts: [
      {
        description: "Copy generated code",
        keys: ["Ctrl", "C"],
      },
    ],
  },
  {
    category: "Field Management",
    shortcuts: [
      {
        description: "Duplicate selected field",
        keys: ["Ctrl", "D"],
      },
      {
        description: "Delete selected field",
        keys: ["Delete"],
        alternativeKeys: ["Backspace"],
      },
      {
        description: "Deselect field",
        keys: ["Escape"],
      },
      {
        description: "Select previous field",
        keys: ["↑"],
      },
      {
        description: "Select next field",
        keys: ["↓"],
      },
      {
        description: "Move field up",
        keys: ["Ctrl", "↑"],
      },
      {
        description: "Move field down",
        keys: ["Ctrl", "↓"],
      },
    ],
  },
  {
    category: "Quick Field Creation",
    shortcuts: [
      {
        description: "Add Text field",
        keys: ["Ctrl", "Alt", "I"],
      },
      {
        description: "Add Textarea field",
        keys: ["Ctrl", "Alt", "A"],
      },
      {
        description: "Add Email field",
        keys: ["Ctrl", "Alt", "E"],
      },
      {
        description: "Add Password field",
        keys: ["Ctrl", "Alt", "P"],
      },
      {
        description: "Add Number field",
        keys: ["Ctrl", "Alt", "N"],
      },
      {
        description: "Add Select field",
        keys: ["Ctrl", "Alt", "S"],
      },
      {
        description: "Add Checkbox field",
        keys: ["Ctrl", "Alt", "C"],
      },
      {
        description: "Add Radio field",
        keys: ["Ctrl", "Alt", "R"],
      },
      {
        description: "Add Combobox field",
        keys: ["Ctrl", "Alt", "O"],
      },
      {
        description: "Add Datepicker field",
        keys: ["Ctrl", "Alt", "Y"],
      },
    ],
  },
];

export function KeyboardShortcutsDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: KeyboardShortcutsDialogProps = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Detect if running on Mac
  const isMac =
    typeof window !== "undefined" &&
    (navigator.platform.includes("Mac") ||
      navigator.userAgent.includes("Mac"));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Keyboard className="w-4 h-4" />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to work faster in the form builder.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {keyboardShortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-2">
                      <KbdGroup>
                        {shortcut.keys.map((key, keyIndex) => {
                          let displayKey = key;
                          if (key === "Ctrl") {
                            displayKey = isMac ? "⌘" : "Ctrl";
                          } else if (key === "Alt") {
                            displayKey = isMac ? "⌥" : "Alt";
                          } else if (key === "Delete") {
                            displayKey = "Del";
                          } else if (key === "Backspace") {
                            displayKey = "⌫";
                          } else if (key === "Escape") {
                            displayKey = "Esc";
                          } else if (key === "↑") {
                            displayKey = "↑";
                          } else if (key === "↓") {
                            displayKey = "↓";
                          }

                          return (
                            <React.Fragment key={keyIndex}>
                              <Kbd>{displayKey}</Kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-muted-foreground mx-1">
                                  +
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </KbdGroup>
                      {shortcut.alternativeKeys && (
                        <>
                          <span className="text-muted-foreground text-xs">or</span>
                          <KbdGroup>
                            {shortcut.alternativeKeys.map((key, keyIndex) => {
                              let displayKey = key;
                              if (key === "Ctrl") {
                                displayKey = isMac ? "⌘" : "Ctrl";
                              } else if (key === "Alt") {
                                displayKey = isMac ? "⌥" : "Alt";
                              } else if (key === "Delete") {
                                displayKey = "Del";
                              } else if (key === "Backspace") {
                                displayKey = "⌫";
                              } else if (key === "Escape") {
                                displayKey = "Esc";
                              } else if (key === "↑") {
                                displayKey = "↑";
                              } else if (key === "↓") {
                                displayKey = "↓";
                              }

                              return (
                                <React.Fragment key={keyIndex}>
                                  <Kbd>{displayKey}</Kbd>
                                  {keyIndex < shortcut.alternativeKeys!.length - 1 && (
                                    <span className="text-muted-foreground mx-1">
                                      +
                                    </span>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </KbdGroup>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
