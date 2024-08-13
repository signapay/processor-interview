import Link from "next/link";

import { Container } from "./ui/container";
import { ModeToggle } from "./mode-toggle";


export default function Header() {
  return (
    <header className="bg-gray-400 dark:bg-black sm:flex sm:justify-between py-3 px-4 border-b sticky top-0">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Link href={"/"}>
              <h1 className="text-xl font-bold">Processor-Interview</h1>
            </Link>
          </div>
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">

          </nav>
          <div>
          <ModeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
