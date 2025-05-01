import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return "loading";
  if (error) return "not logged in";

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        {/* <Avatar>
          {data.user.picture && (
            <AvatarImage src={data.user.picture} alt={data.user.given_name} />
          )}
          <AvatarFallback>{data.user.given_name}</AvatarFallback>
        </Avatar> */}
        <p>
          {data.given_name} {data.family_name}
        </p>
      </div>

      <a href="/api/logout" className="btn btn-error">
        Logout!
      </a>
    </div>
  );
}
