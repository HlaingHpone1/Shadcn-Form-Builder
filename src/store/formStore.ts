import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FormStore {
  fields: FormField[];
  setFields: (fields: FormField[]) => void;
  addField: (field: FormField) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      fields: [],
      setFields: (fields) => set({ fields }),
      addField: (field) =>
        set((state) => ({ fields: [...state.fields, field] })),
      updateField: (id, updates) =>
        set((state) => ({
          fields: state.fields.map((field) =>
            field.id === id ? { ...field, ...updates } : field,
          ),
        })),
      removeField: (id) =>
        set((state) => ({
          fields: state.fields.filter((field) => field.id !== id),
        })),
      selectedFieldId: null,
      setSelectedFieldId: (id) => set({ selectedFieldId: id }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "form-builder-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        fields: state.fields,
        selectedFieldId: state.selectedFieldId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
