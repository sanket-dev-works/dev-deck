export default function ToolLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse mt-2" />
        <div className="h-6 w-48 bg-muted rounded animate-pulse mt-3" />
      </div>
      <div className="space-y-4">
        <div className="h-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-48 bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
