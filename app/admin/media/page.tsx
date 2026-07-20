import { Search, Filter, Image as ImageIcon, FileText, Video, File, Folder } from "lucide-react";
import { db } from "@/db";
import { MediaUploader, MediaDeleteButton } from "./MediaUploader";

export const dynamic = "force-dynamic";

export default async function MediaLibrary() {
  const mediaFiles = await db.query.mediaAssets.findMany({
    orderBy: (mediaAssets, { desc }) => [desc(mediaAssets.createdAt)],
  });

  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return { icon: ImageIcon, color: "text-blue-500" };
    if (type.startsWith("video/")) return { icon: Video, color: "text-purple-500" };
    if (type === "application/pdf") return { icon: FileText, color: "text-red-500" };
    return { icon: File, color: "text-green-500" };
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Media Library</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Central asset manager for all educational content.</p>
        </div>
        <MediaUploader />
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search media..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-transparent focus:border-foreground/30 focus:bg-transparent rounded-lg font-medium text-sm outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm font-bold transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* LEFT FOLDERS */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground mb-4">Folders</h3>
          <div className="space-y-1">
            {["All Media", "Images", "Videos", "Documents"].map((folder, i) => (
              <button key={i} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${i === 0 ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                <span className="flex items-center gap-2"><Folder className="w-4 h-4" /> {folder}</span>
                {i === 0 && <span className="text-xs bg-muted px-1.5 rounded text-muted-foreground">{mediaFiles.length}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* MEDIA GRID */}
        <div className="lg:col-span-3">
          {mediaFiles.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl">
              <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold text-lg">No media uploaded</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload images or files to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaFiles.map((media) => {
                const { icon: Icon, color } = getIcon(media.fileType);
                const isImage = media.fileType.startsWith('image/');
                
                return (
                  <div key={media.id} className="bg-card border border-border rounded-xl p-3 group hover:border-foreground/30 transition-colors relative">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                      <MediaDeleteButton id={media.id} />
                    </div>
                    
                    <a href={media.url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center mb-3 overflow-hidden relative">
                        {isImage ? (
                          <img src={media.url} alt={media.filename} className="w-full h-full object-cover" />
                        ) : (
                          <Icon className={`w-8 h-8 ${color}`} />
                        )}
                      </div>
                      <div className="font-bold text-xs truncate mb-1" title={media.filename}>{media.filename}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase flex justify-between">
                        <span>{formatSize(media.sizeBytes)}</span>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
