"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { saveMediaMetadata } from "../../../actions";
import { toast } from "sonner";

interface ImageUploadPlaceholderProps {
  prompt: string;
  uploadPathPrefix: string;
  onUpload: (url: string) => void;
}

export function ImageUploadPlaceholder({ prompt, uploadPathPrefix, onUpload }: ImageUploadPlaceholderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(10);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Must be logged in to upload");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${uploadPathPrefix}/${fileName}`;

      setProgress(40);
      
      const { error: uploadError } = await supabase.storage
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
      onUpload(publicUrl);
    } catch (error: any) {
      toast.error(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="my-6 border-2 border-dashed border-primary/40 bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-inner">
      <div className="flex items-center gap-2 mb-2 text-primary font-bold">
        <ImageIcon className="w-5 h-5" />
        <span>Image Required</span>
      </div>
      <p className="text-sm font-medium mb-5 max-w-lg text-foreground/80">{prompt}</p>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`bg-card border border-border shadow-sm rounded-lg px-6 py-3 cursor-pointer hover:bg-muted transition-all flex items-center gap-3 ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input 
          type="file" 
          accept="image/*"
          ref={fileInputRef} 
          onChange={onFileChange} 
          className="hidden" 
          disabled={uploading}
        />
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm font-bold">Uploading ({progress}%)</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold">Click to Upload Image</span>
          </>
        )}
      </div>
    </div>
  );
}
