export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <Skeleton className="h-48 w-full rounded-md mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-8 w-full mt-4" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 border-b pb-4">
      <Skeleton className="w-20 h-20 rounded" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-16 mb-2" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  );
}