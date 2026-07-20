"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video, FileText, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { saveMediaMetadata } from "../actions";

export function MediaUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(10);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Must be logged in to upload");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      setProgress(40);
      
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      setProgress(80);

      // Get public URL
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Save metadata to DB via Server Action
      await saveMediaMetadata({
        id: fileName, // Using filename as ID for simplicity
        userId: userData.user.id,
        filename: file.name,
        fileType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        url: publicUrl,
      });

      setProgress(100);
      setTimeout(() => {
        setIsOpen(false);
        setUploading(false);
        setProgress(0);
        router.refresh(); // Refresh page data
      }, 500);

    } catch (error: any) {
      alert(`Error uploading file: ${error.message}`);
      setUploading(false);
      setProgress(0);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-foreground text-background px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <Upload className="w-4 h-4" /> Upload Media
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">Upload File</h3>
              <button 
                onClick={() => !uploading && setIsOpen(false)}
                className="p-1 hover:bg-muted rounded text-muted-foreground disabled:opacity-50"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isDragging ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"
                } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  className="hidden" 
                  disabled={uploading}
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="font-bold text-sm mb-1">Click or drag file to upload</p>
                    <p className="text-xs font-medium text-muted-foreground max-w-[200px]">
                      Supports images, videos, and PDFs up to 50MB.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MediaDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    setLoading(true);
    
    try {
      // Delete from bucket
      await supabase.storage.from('media').remove([id]);
      
      // Delete from DB (action handles revalidation)
      const { deleteMediaAsset } = await import('../actions');
      await deleteMediaAsset(id);
    } catch (err) {
      alert("Error deleting file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-600 p-1"
      title="Delete"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
    </button>
  );
}
