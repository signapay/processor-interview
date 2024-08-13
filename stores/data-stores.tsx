import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

interface DataStore {
  data: any[] | undefined;
  isLoadingStore:boolean;
  badTransactionsData: any[] | undefined;
  collectionsData: any[] | undefined;
  statsData: any[] | undefined;
  creditMask: boolean;
  targetMask: boolean;
  toggleTargetMask: () => void;
  toggleCreditMask: () => void;
  updateData: (data: any[]) => void;
  updateBadData: (data: any[]) => void;
  updateLoadingState: (val:boolean) => void;
  reset: () => void;
}

const initialState = {
  data: undefined,
  badTransactionsData: undefined,
  collectionsData: undefined,
  statsData: undefined,
};

//custom storage using indexdb w/ zustand  
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      ...initialState,
      isLoadingStore:false,
      creditMask: true,
      targetMask: true,
      updateLoadingState: (val) =>
        set((state) => ({ isLoadingStore: val })),
      toggleCreditMask: () =>
        set((state) => ({ creditMask: !state.creditMask })),
      toggleTargetMask: () =>
        set((state) => ({ targetMask: !state.targetMask })),
      updateBadData: (data) => {
        set((state) => {
          let temp = data;
          if (state.badTransactionsData)
            temp = temp.concat(state.badTransactionsData);
          return { badTransactionsData: temp };
        });
      },
      updateData: (data) => {
        set((state) => {
          let temp = data;
          if (state.data) temp = temp.concat(state.data);

          let distinctAccounts: string[] = [
            ...new Set(temp?.map((data: any) => data.accountName)),
          ];
          //using the distinct accounts we have lets start grouping data..
          const stats = distinctAccounts.map((name) => {
            const transList = temp?.filter((f: any) => f.accountName == name);
            const totalTransactions = transList?.length;
            const totalNegRecordsCount = transList?.filter(
              (f: any) => f.amount < 0.0
            ).length;
            const totalBal = transList?.reduce((acc, bal: any) => {
              return acc + bal.amount;
            }, 0);

            return {
              accountName: name,
              totalTransactions: totalTransactions,
              totalNegative: totalNegRecordsCount,
              totalAmount: totalBal,
            };
          });

          state.statsData = stats;
          state.collectionsData = stats.filter((f) => f.totalAmount < 0.0); //anyone with a -neg total should be marked for collections

          return { data: temp };
        });
      },
      reset: () => set(initialState),
    }),

    {
      name: "data-store",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: (state) => {
        state.isLoadingStore = true

        // optional
        return (state, error) => {
            state?.updateLoadingState(false);
          if (error) {
            //console.log("an error happened during hydration", error);
          } else {
            //console.log("hydration finished");
            
          }
        };
      },
    }
  )
);
