import { create } from "zustand";
import { persist,createJSONStorage  } from "zustand/middleware";

interface DataStore {
  data: any[] | null;
  creditMask:boolean;  
  targetMask:boolean;
  updateData: (data:any[]) => void;
};

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      data: [],
      creditMask:true,
      targetMask:true,
      toggleCreditMask: () => set((state) => ({creditMask: !state.creditMask})),
      toggleTargetMask: () => set((state) => ({targetMask: !state.targetMask})),
      updateData: (d) => {
        set((state) => {
          return { data: d };
        });
      },
    }),
    { name: "data-store", storage: createJSONStorage(() => localStorage) }
  )
); 


