"use client";

import React, { useState } from "react";
import { Code, Eye, Copy, Settings } from "lucide-react";
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

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);

  const [componentInfo, setComponentInfo] = useState<ComponentInfo>({
    functionName: "MyGeneratedForm",
    schemaName: "formSchema",
    schemaType: "MyFormType",
  });

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Form Builder</h1>
          <div className="flex items-center gap-3">
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
                          setComponentInfo((prev) => ({
                            ...prev,
                            functionName: e.target.value,
                          }))
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
                          setComponentInfo((prev) => ({
                            ...prev,
                            schemaName: e.target.value,
                          }))
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
                          setComponentInfo((prev) => ({
                            ...prev,
                            schemaType: e.target.value,
                          }))
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
          <BuilderPanel
            selectedField={selectedField}
            fields={fields}
            setFields={setFields}
            setSelectedFieldId={setSelectedFieldId}
          />
        </div>

        {/* --- RIGHT PANEL: PREVIEW / CODE --- */}
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 p-6 bg-white overflow-auto">
              {activeTab === "preview" ? (
                <PreviewTab fields={fields} />
              ) : (
                <div className="relative h-full">
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm overflow-auto font-mono h-full">
                    {generateCode(fields, componentInfo)}
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        generateCode(fields, componentInfo),
                      );
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
