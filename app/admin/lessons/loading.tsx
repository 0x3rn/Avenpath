export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-pulse w-full">
      <div className="h-10 w-64 bg-muted rounded-lg" />
      <div className="h-4 w-96 bg-muted rounded" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 w-full">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-card border border-border rounded-3xl p-6 flex flex-col gap-4">
             <div className="w-12 h-12 bg-muted rounded-xl" />
             <div className="h-6 w-3/4 bg-muted rounded" />
             <div className="h-4 w-full bg-muted rounded" />
             <div className="h-4 w-5/6 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
