import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 w-full flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin text-foreground/50" />
        <span className="font-bold text-sm tracking-widest uppercase">Loading Admin...</span>
      </div>
    </div>
  );
}
