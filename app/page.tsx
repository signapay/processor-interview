import Accounts from "@/components/accounts";
import { Container } from "@/components/ui/container";
import UploadFile from "@/components/upload-file";
import Image from "next/image";

export default function Home() {
  return (
    <Container>
      <main className="py-4">
        <div className="flex justify-end">
          <UploadFile />
        </div>
        <Accounts/>
      </main>
    </Container>
  );
}
