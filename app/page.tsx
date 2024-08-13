"use client";
import Accounts from "@/components/accounts";
import BadTransactions from "@/components/bad-transactions";
import Collections from "@/components/collections";
import { Container } from "@/components/ui/container";
import UploadFile from "@/components/upload-file";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataStore } from "@/stores/data-stores";
import ClearStore from "@/components/clear-store";

export default function Home() {
  const { data } = useDataStore();
  return (
    <Container>
      <main className="py-4 space-y-3">
        <div className="flex justify-end space-x-3">
          <UploadFile />
          {data && <ClearStore/>}
        </div>
        {!data && "Pleaes upload data to continue!"}
        {data && data.length > 0 && (
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Accounts</TabsTrigger>
              <TabsTrigger value="password">Bad Transactions</TabsTrigger>
              <TabsTrigger value="wer">Collections</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Accounts />
            </TabsContent>
            <TabsContent value="password">
              <BadTransactions />
            </TabsContent>
            <TabsContent value="wer">
              <Collections />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </Container>
  );
}
