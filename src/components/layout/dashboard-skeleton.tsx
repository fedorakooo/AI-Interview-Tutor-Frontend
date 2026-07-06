import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-card p-4 md:block">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="h-40 w-full max-w-2xl" />
      </main>
    </div>
  );
}
