import { init } from "next/dist/compiled/webpack/webpack";
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

interface DataStore {
  data: any[] | undefined;
  badTransactionsData: any[] | undefined;
  collectionsData: any[] | undefined;
  statsData: any[] | undefined;
  creditMask: boolean;
  targetMask: boolean;
  toggleTargetMask: () => void;
  toggleCreditMask: () => void;
  updateData: (data: any[]) => void;
  updateBadData: (data: any[]) => void;
  reset: () => void;
}

const initialState = {
  data: undefined,
  badTransactionsData: undefined,
  collectionsData: undefined,
  statsData: undefined,
};

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
      creditMask: true,
      targetMask: true,
      toggleCreditMask: () =>
        set((state) => ({ creditMask: !state.creditMask })),
      toggleTargetMask: () =>
        set((state) => ({ targetMask: !state.targetMask })),
      updateBadData: (temp) => {
        set((state) => {
          return { badTransactionsData: temp };
        });
      },
      updateData: (temp) => {
        set((state) => {
          let tmp = temp;
          if (state.data) tmp = tmp.concat(state.data);

          let distinctAccounts: string[] = [
            ...new Set(tmp?.map((data: any) => data.accountName)),
          ];
          //using the distinct accounts we have lets start grouping data..
          const stats = distinctAccounts.map((name) => {
            const transList = tmp?.filter((f: any) => f.accountName == name);
            const totalTrans = transList?.length;
            const totalNegRecords = transList?.filter(
              (f: any) => f.amount < 0.0
            ).length;
            const totalBal = transList?.reduce((acc, bal: any) => {
              return acc + bal.amount;
            }, 0);

            return {
              accountName: name,
              totalTransactions: totalTrans,
              totalNegative: totalNegRecords,
              totalAmount: totalBal,
            };
          });

          state.statsData = stats;
          state.collectionsData = stats.filter((f) => f.totalAmount < 0.0); //anyone with a -neg total should be marked for collections

          return { data: tmp };
        });
      },
      reset: () => set(initialState),
    }),
    { name: "data-store", storage: createJSONStorage(() => storage) }
  )
);
