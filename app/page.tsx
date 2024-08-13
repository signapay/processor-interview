"use client";
import Accounts from "@/components/accounts";
import BadTransactions from "@/components/bad-transactions";
import Collections from "@/components/collections";
import { Container } from "@/components/ui/container";
import UploadFile from "@/components/upload-file";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataStore } from "@/stores/data-stores";
import ClearStore from "@/components/clear-store";
import { PageSkeleton } from "@/components/layout/page-skeleton";

export default function Home() {
  const { data, isLoadingStore } = useDataStore();
  return (
    <Container>
      {isLoadingStore && (
        <div className="mx-auto justify-center flex py-4">
          <PageSkeleton />
        </div>
      )}
      {!isLoadingStore && (
        <main className="py-4 space-y-3">
          <div className="flex justify-end space-x-3">
            <UploadFile />
            {data && <ClearStore />}
          </div>
          {!data && (
            <div className="mx-auto justify-center flex py-4">
              Please upload data to continue!
            </div>
          )}
          {data && data.length > 0 && (
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="badtransactions">
                  Bad Transactions
                </TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Accounts />
              </TabsContent>
              <TabsContent value="badtransactions">
                <BadTransactions />
              </TabsContent>
              <TabsContent value="collections">
                <Collections />
              </TabsContent>
            </Tabs>
          )}
        </main>
      )}
    </Container>
  );
}
