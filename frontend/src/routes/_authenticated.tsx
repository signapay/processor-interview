import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return { user: data };
    } catch {
      return { user: null };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <Outlet />;
}
