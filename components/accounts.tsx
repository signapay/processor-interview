"use client";
import { useDataStore } from "@/stores/data-stores";

export default function Accounts() {
  const { data } = useDataStore();
  return <>{data && data.length > 0 && <>Account component</>}</>;
}
