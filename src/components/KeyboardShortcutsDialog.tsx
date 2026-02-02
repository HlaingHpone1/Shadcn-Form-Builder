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
        keys: ["Ctrl", "Control", "I"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Textarea field",
        keys: ["Ctrl", "Control", "A"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Email field",
        keys: ["Ctrl", "Control", "E"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Password field",
        keys: ["Ctrl", "Control", "P"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Number field",
        keys: ["Ctrl", "Control", "N"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Select field",
        keys: ["Ctrl", "Control", "S"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Checkbox field",
        keys: ["Ctrl", "Control", "C"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Radio field",
        keys: ["Ctrl", "Control", "R"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Combobox field",
        keys: ["Ctrl", "Control", "O"], // Control on Mac, Alt on Windows/Linux
      },
      {
        description: "Add Datepicker field",
        keys: ["Ctrl", "Control", "Y"], // Control on Mac, Alt on Windows/Linux
      },
    ],
  },
  {
    category: "UI & Utility Actions",
    shortcuts: [
      {
        description: "Toggle required flag on selected field",
        keys: ["Ctrl", "Shift", "R"],
      },
      {
        description: "Clear all fields",
        keys: ["Ctrl", "Shift", "Delete"],
      },
      {
        description: "Open command palette",
        keys: ["Ctrl", "K"],
      },
      {
        description: "Focus field list search",
        keys: ["Ctrl", "F"],
      },
    ],
  },
  {
    category: "Advanced Features",
    shortcuts: [
      {
        description: "Undo last action",
        keys: ["Ctrl", "Z"],
      },
      {
        description: "Redo",
        keys: ["Ctrl", "Shift", "Z"],
        alternativeKeys: ["Ctrl", "Y"],
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
                          } else if (key === "Control") {
                            // Control key: show ⌃ on Mac, Alt on Windows/Linux
                            displayKey = isMac ? "⌃" : "Alt";
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
                              } else if (key === "Control") {
                                // Control key: show ⌃ on Mac, Alt on Windows/Linux
                                displayKey = isMac ? "⌃" : "Alt";
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
