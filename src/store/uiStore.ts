import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIStore {
  activeTab: "preview" | "code";
  setActiveTab: (tab: "preview" | "code") => void;
  componentInfo: ComponentInfo;
  setComponentInfo: (info: ComponentInfo) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeTab: "preview",
      setActiveTab: (tab) => set({ activeTab: tab }),
      componentInfo: {
        functionName: "MyGeneratedForm",
        schemaName: "formSchema",
        schemaType: "MyFormType",
      },
      setComponentInfo: (info) => set({ componentInfo: info }),
    }),
    {
      name: "form-builder-ui-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
