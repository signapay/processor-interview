import { Skeleton } from "@/components/ui/skeleton";
export function PageSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[650px] w-[950px]" />
    </div>
  );
}
