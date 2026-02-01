import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FieldTypeEnum } from "@/constants";
import type { HTMLInputTypeAttribute } from "react";

interface FormStore {
  fields: FormField[];
  setFields: (fields: FormField[]) => void;
  addField: (field: FormField) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  deleteSelectedField: () => void;
  selectNextField: () => void;
  selectPreviousField: () => void;
  moveFieldUp: (id: string) => void;
  moveFieldDown: (id: string) => void;
  quickAddField: (type: FieldType, formType?: HTMLInputTypeAttribute) => void;
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
      duplicateField: (id) =>
        set((state) => {
          const fieldToDuplicate = state.fields.find((f) => f.id === id);
          if (!fieldToDuplicate) return state;

          const newId = crypto.randomUUID();

          // Find the next available field number by checking existing field names
          const getNextFieldNumber = () => {
            const fieldNumbers = state.fields
              .map((f) => {
                const match = f.name.match(/^field_(\d+)$/);
                return match ? parseInt(match[1], 10) : 0;
              })
              .filter((num) => num > 0);

            if (fieldNumbers.length === 0) {
              return 1;
            }

            const maxNumber = Math.max(...fieldNumbers);
            return maxNumber + 1;
          };

          const duplicatedField: FormField = {
            ...fieldToDuplicate,
            id: newId,
            name: `field_${getNextFieldNumber()}`,
            label: `${fieldToDuplicate.label} (Copy)`,
          };

          return {
            fields: [...state.fields, duplicatedField],
            selectedFieldId: newId,
          };
        }),
      deleteSelectedField: () =>
        set((state) => {
          if (!state.selectedFieldId) return state;
          return {
            fields: state.fields.filter(
              (field) => field.id !== state.selectedFieldId,
            ),
            selectedFieldId: null,
          };
        }),
      selectNextField: () =>
        set((state) => {
          if (state.fields.length === 0) return state;
          if (!state.selectedFieldId) {
            // If nothing selected, select first field
            return { selectedFieldId: state.fields[0].id };
          }
          const currentIndex = state.fields.findIndex(
            (f) => f.id === state.selectedFieldId,
          );
          if (currentIndex === -1) return state;
          const nextIndex = (currentIndex + 1) % state.fields.length;
          return { selectedFieldId: state.fields[nextIndex].id };
        }),
      selectPreviousField: () =>
        set((state) => {
          if (state.fields.length === 0) return state;
          if (!state.selectedFieldId) {
            // If nothing selected, select last field
            return { selectedFieldId: state.fields[state.fields.length - 1].id };
          }
          const currentIndex = state.fields.findIndex(
            (f) => f.id === state.selectedFieldId,
          );
          if (currentIndex === -1) return state;
          const prevIndex =
            currentIndex === 0 ? state.fields.length - 1 : currentIndex - 1;
          return { selectedFieldId: state.fields[prevIndex].id };
        }),
      moveFieldUp: (id) =>
        set((state) => {
          const currentIndex = state.fields.findIndex((f) => f.id === id);
          if (currentIndex === -1 || currentIndex === 0) return state;

          const newFields = [...state.fields];
          [newFields[currentIndex - 1], newFields[currentIndex]] = [
            newFields[currentIndex],
            newFields[currentIndex - 1],
          ];

          return { fields: newFields };
        }),
      moveFieldDown: (id) =>
        set((state) => {
          const currentIndex = state.fields.findIndex((f) => f.id === id);
          if (
            currentIndex === -1 ||
            currentIndex === state.fields.length - 1
          )
            return state;

          const newFields = [...state.fields];
          [newFields[currentIndex], newFields[currentIndex + 1]] = [
            newFields[currentIndex + 1],
            newFields[currentIndex],
          ];

          return { fields: newFields };
        }),
      quickAddField: (type, formTypeOverride) =>
        set((state) => {
          const newId = crypto.randomUUID();

          // Find the next available field number by checking existing field names
          const getNextFieldNumber = () => {
            const fieldNumbers = state.fields
              .map((f) => {
                const match = f.name.match(/^field_(\d+)$/);
                return match ? parseInt(match[1], 10) : 0;
              })
              .filter((num) => num > 0);

            if (fieldNumbers.length === 0) {
              return 1;
            }

            const maxNumber = Math.max(...fieldNumbers);
            return maxNumber + 1;
          };

          // Determine formType based on field type or override
          let formType: HTMLInputTypeAttribute = "text";
          if (formTypeOverride) {
            formType = formTypeOverride;
          } else if (type === FieldTypeEnum.NUMBER) {
            formType = "number";
          }

          const newField: FormField = {
            id: newId,
            name: `field_${getNextFieldNumber()}`,
            label: "New Label",
            type,
            isMulti: false,
            styleType: type === FieldTypeEnum.COMBOBOX ? "base-ui" : "radix-ui",
            required: false,
            formType,
          };

          return {
            fields: [...state.fields, newField],
            selectedFieldId: newId,
          };
        }),
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
