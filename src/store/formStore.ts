import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FieldTypeEnum } from "@/constants";
import type { HTMLInputTypeAttribute } from "react";

interface FormState {
  fields: FormField[];
  selectedFieldId: string | null;
}

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
  toggleRequired: (id: string) => void;
  clearAllFields: () => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  // Undo/Redo
  history: FormState[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Select all
  selectAllFields: () => void;
  selectedFieldIds: string[];
  setSelectedFieldIds: (ids: string[]) => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const MAX_HISTORY_SIZE = 50;

const saveToHistory = (state: FormStore): FormState => ({
  fields: JSON.parse(JSON.stringify(state.fields)), // Deep clone
  selectedFieldId: state.selectedFieldId,
});

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => {
      const initialState: FormState = {
        fields: [],
        selectedFieldId: null,
      };

      const addToHistory = (newState: Partial<FormStore>) => {
        const state = get();
        const historyState = saveToHistory({ ...state, ...newState } as FormStore);
        const newHistory = [
          ...state.history.slice(0, state.historyIndex + 1),
          historyState,
        ].slice(-MAX_HISTORY_SIZE);
        return {
          ...newState,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          canUndo: true,
          canRedo: false,
        };
      };

      return {
        fields: [],
        history: [initialState],
        historyIndex: 0,
        canUndo: false,
        canRedo: false,
        selectedFieldIds: [],
        setSelectedFieldIds: (ids) => set({ selectedFieldIds: ids }),
        selectAllFields: () =>
          set((state) => ({
            selectedFieldIds: state.fields.map((f) => f.id),
          })),
        undo: () =>
          set((state) => {
            if (state.historyIndex <= 0) return state;
            const newIndex = state.historyIndex - 1;
            const previousState = state.history[newIndex];
            return {
              fields: previousState.fields,
              selectedFieldId: previousState.selectedFieldId,
              historyIndex: newIndex,
              canUndo: newIndex > 0,
              canRedo: true,
            };
          }),
        redo: () =>
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state;
            const newIndex = state.historyIndex + 1;
            const nextState = state.history[newIndex];
            return {
              fields: nextState.fields,
              selectedFieldId: nextState.selectedFieldId,
              historyIndex: newIndex,
              canUndo: true,
              canRedo: newIndex < state.history.length - 1,
            };
          }),
        setFields: (fields) => set(addToHistory({ fields })),
        addField: (field) => {
          const state = get();
          set(addToHistory({ fields: [...state.fields, field] }));
        },
        updateField: (id, updates) => {
          const state = get();
          const newFields = state.fields.map((f) =>
            f.id === id ? { ...f, ...updates } : f,
          );
          set(addToHistory({ fields: newFields }));
        },
        removeField: (id) => {
          const state = get();
          const newFields = state.fields.filter((f) => f.id !== id);
          const newSelectedFieldId =
            state.selectedFieldId === id ? null : state.selectedFieldId;
          set(addToHistory({ fields: newFields, selectedFieldId: newSelectedFieldId }));
        },
        duplicateField: (id) => {
          const state = get();
          const fieldToDuplicate = state.fields.find((f) => f.id === id);
          if (!fieldToDuplicate) return;

          const newId = crypto.randomUUID();

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

          const newFields = [...state.fields, duplicatedField];
          set(addToHistory({ fields: newFields, selectedFieldId: newId }));
        },
        deleteSelectedField: () => {
          const state = get();
          if (!state.selectedFieldId) return;
          const newFields = state.fields.filter(
            (f) => f.id !== state.selectedFieldId,
          );
          set(addToHistory({ fields: newFields, selectedFieldId: null }));
        },
        selectNextField: () =>
          set((state) => {
            if (state.fields.length === 0) return state;
            if (!state.selectedFieldId) {
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
        moveFieldUp: (id) => {
          const state = get();
          const currentIndex = state.fields.findIndex((f) => f.id === id);
          if (currentIndex === -1 || currentIndex === 0) return;

          const newFields = [...state.fields];
          [newFields[currentIndex - 1], newFields[currentIndex]] = [
            newFields[currentIndex],
            newFields[currentIndex - 1],
          ];

          set(addToHistory({ fields: newFields }));
        },
        moveFieldDown: (id) => {
          const state = get();
          const currentIndex = state.fields.findIndex((f) => f.id === id);
          if (
            currentIndex === -1 ||
            currentIndex === state.fields.length - 1
          )
            return;

          const newFields = [...state.fields];
          [newFields[currentIndex], newFields[currentIndex + 1]] = [
            newFields[currentIndex + 1],
            newFields[currentIndex],
          ];

          set(addToHistory({ fields: newFields }));
        },
        quickAddField: (type, formTypeOverride) => {
          const state = get();
          const newId = crypto.randomUUID();

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

          const newFields = [...state.fields, newField];
          set(addToHistory({ fields: newFields, selectedFieldId: newId }));
        },
        toggleRequired: (id) => {
          const state = get();
          const field = state.fields.find((f) => f.id === id);
          if (!field) return;
          const newFields = state.fields.map((f) =>
            f.id === id ? { ...f, required: !f.required } : f,
          );
          set(addToHistory({ fields: newFields }));
        },
        clearAllFields: () => {
          const state = get();
          if (state.fields.length === 0) return;
          if (
            confirm(
              "Are you sure you want to clear all fields? This action cannot be undone.",
            )
          ) {
            set(addToHistory({ fields: [], selectedFieldId: null }));
          }
        },
        selectedFieldId: null,
        setSelectedFieldId: (id) => set({ selectedFieldId: id }),
        hasHydrated: false,
        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      };
    },
    {
      name: "form-builder-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        fields: state.fields,
        selectedFieldId: state.selectedFieldId,
        // Don't persist history - it's session-only
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize history with current state after rehydration
          const initialState: FormState = {
            fields: state.fields,
            selectedFieldId: state.selectedFieldId,
          };
          state.history = [initialState];
          state.historyIndex = 0;
          state.canUndo = false;
          state.canRedo = false;
          state.selectedFieldIds = [];
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
