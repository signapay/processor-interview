import NavBar from "@/components/layout/NavBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <NavBar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Outlet />
      </main>
    </>
  );
}
