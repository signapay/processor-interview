import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_transactions/transactions/report")({
  component: SummaryComponent,
});

function SummaryComponent() {
  return <div>Hello "/transactions/summary"!</div>;
}
