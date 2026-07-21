"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImageUploadPlaceholder } from "./ImageUploadPlaceholder";

interface InteractivePreviewProps {
  content: string;
  uploadPathPrefix: string;
  onChange: (newContent: string) => void;
}

export function InteractivePreview({ content, uploadPathPrefix, onChange }: InteractivePreviewProps) {
  // Regex to find [IMAGE REQUIRED: <prompt>]
  const regex = /\[IMAGE REQUIRED:\s*(.+?)\]/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ 
        type: 'markdown', 
        content: content.substring(lastIndex, match.index) 
      });
    }
    parts.push({ 
      type: 'placeholder', 
      prompt: match[1], 
      fullMatch: match[0] 
    });
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < content.length) {
    parts.push({ 
      type: 'markdown', 
      content: content.substring(lastIndex) 
    });
  }

  const handleUpload = (fullMatch: string, prompt: string, url: string) => {
    // Replace the exact tag with markdown image syntax
    const markdownImage = `![${prompt}](${url})`;
    const newContent = content.replace(fullMatch, markdownImage);
    onChange(newContent);
  };

  return (
    <div className="prose dark:prose-invert max-w-none w-full bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
      {parts.length === 0 || !content.trim() ? (
        <div className="text-muted-foreground text-sm italic">No content to preview yet.</div>
      ) : (
        parts.map((part, i) => {
          if (part.type === 'markdown') {
            return (
              <ReactMarkdown remarkPlugins={[remarkGfm]} key={`md-${i}`}>
                {part.content}
              </ReactMarkdown>
            );
          }
          if (part.type === 'placeholder') {
            return (
              <ImageUploadPlaceholder 
                key={`ph-${i}`} 
                prompt={part.prompt!} 
                uploadPathPrefix={uploadPathPrefix}
                onUpload={(url) => handleUpload(part.fullMatch!, part.prompt!, url)} 
              />
            );
          }
          return null;
        })
      )}
    </div>
  );
}
