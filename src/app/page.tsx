"use client";

import React, { useState } from "react";
import { Code, Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BuilderPanel from "@/templates/form/BuilderPanel";
import PreviewTab from "@/templates/form/PreviewTab";
import { generateCode } from "@/templates/form/generators/FormGenerator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([]);

  const [componentInfo, setComponentInfo] = useState<ComponentInfo>({
    functionName: "MyGeneratedForm",
    schemaName: "formSchema",
    schemaType: "MyFormType",
  });

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Helper to get currently selected field object
  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex gap-6">
      {/* --- LEFT PANEL: BUILDER --- */}
      <BuilderPanel
        selectedField={selectedField}
        fields={fields}
        setFields={setFields}
        setSelectedFieldId={setSelectedFieldId}
      />
      {/* --- RIGHT PANEL: PREVIEW / CODE --- */}
      <div className="w-2/3">
        <Card className="h-full flex flex-col">
          <CardHeader className=" border-b pb-4">
            <h1 className="text-2xl mb-3">Component Info</h1>

            <div className="flex gap-3">
              <div className="">
                <Label className="mb-2">Function Name</Label>
                <Input
                  value={componentInfo.functionName}
                  placeholder="Function Name"
                  onChange={(e) =>
                    setComponentInfo((prev) => ({
                      ...prev,
                      functionName: e.target.value,
                    }))
                  }
                  type="text"
                />
              </div>

              <div className="">
                <Label className="mb-2">Schema Name</Label>
                <Input
                  value={componentInfo.schemaName}
                  placeholder="Schema Name"
                  onChange={(e) =>
                    setComponentInfo((prev) => ({
                      ...prev,
                      schemaName: e.target.value,
                    }))
                  }
                  type="text"
                />
              </div>

              <div className="">
                <Label className="mb-2">Schema Type</Label>
                <Input
                  value={componentInfo.schemaType}
                  placeholder="Function Name"
                  onChange={(e) =>
                    setComponentInfo((prev) => ({
                      ...prev,
                      schemaType: e.target.value,
                    }))
                  }
                  type="text"
                />
              </div>
            </div>

            <div className="flex space-x-2 bg-muted p-1 rounded-md">
              <Button
                variant={activeTab === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="w-4 h-4 mr-2" /> Preview
              </Button>
              <Button
                variant={activeTab === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("code")}
              >
                <Code className="w-4 h-4 mr-2" /> Code
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6 bg-white overflow-auto">
            {activeTab === "preview" ? (
              <PreviewTab fields={fields} />
            ) : (
              <div className="relative">
                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm overflow-auto font-mono h-150">
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
  );
}
