"use client";

import { useFormStore } from "@/store/formStore";
import { DynamicFormRenderer } from "@/templates/form/DynamicFormRenderer";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export default function FormPage() {
  const fields = useFormStore((state) => state.fields);
  const hasHydrated = useFormStore((state) => state.hasHydrated);
  const setHasHydrated = useFormStore((state) => state.setHasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      setHasHydrated(true);
    }
  }, [hasHydrated, setHasHydrated]);

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Generated Form</h1>
          <p className="text-sm text-muted-foreground">
            This form is generated from the fields stored in session storage.
            {fields.length > 0 && (
              <span className="ml-1">
                ({fields.length} {fields.length === 1 ? "field" : "fields"})
              </span>
            )}
          </p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6">
          {fields.length > 0 && <DynamicFormRenderer fields={fields} />}
        </div>
      </div>
    </div>
  );
}
