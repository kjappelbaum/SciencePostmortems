"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const Editor = ({
  initialContent = "",
  onChange,
  placeholder = "Start writing...",
  minHeight = "200px",
}: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="border border-[#E0E0E0] rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-1.5 border-b border-[#E0E0E0] bg-[#FAFAFA]">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive("bold")
              ? "bg-[#f8f0f0] text-[#A43830]"
              : "text-[#666666] hover:bg-[#f8f0f0] hover:text-[#A43830]"
          }`}
          title="Bold"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive("italic")
              ? "bg-[#f8f0f0] text-[#A43830]"
              : "text-[#666666] hover:bg-[#f8f0f0] hover:text-[#A43830]"
          }`}
          title="Italic"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>

        <div className="w-px h-6 mx-1 bg-[#E0E0E0] self-center"></div>

        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive("heading", { level: 2 })
              ? "bg-[#f8f0f0] text-[#A43830]"
              : "text-[#666666] hover:bg-[#f8f0f0] hover:text-[#A43830]"
          }`}
          title="Heading"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 12h12"></path>
            <path d="M6 4v16"></path>
            <path d="M18 4v16"></path>
          </svg>
        </button>

        <div className="w-px h-6 mx-1 bg-[#E0E0E0] self-center"></div>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive("bulletList")
              ? "bg-[#f8f0f0] text-[#A43830]"
              : "text-[#666666] hover:bg-[#f8f0f0] hover:text-[#A43830]"
          }`}
          title="Bullet List"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive("orderedList")
              ? "bg-[#f8f0f0] text-[#A43830]"
              : "text-[#666666] hover:bg-[#f8f0f0] hover:text-[#A43830]"
          }`}
          title="Ordered List"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>

        <div className="w-px h-6 mx-1 bg-[#E0E0E0] self-center"></div>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded transition-colors ${
            editor?.isActive("codeBlock")
              ? "bg-[#f8f0f0] text-[#A43830]"
              : "text-[#666666] hover:bg-[#f8f0f0] hover:text-[#A43830]"
          }`}
          title="Code Block"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </button>
      </div>

      <div className="relative" style={{ minHeight }}>
        {!editor?.getText() && (
          <div className="absolute top-4 left-4 text-[#999999] pointer-events-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} className="prose max-w-none p-4" />
      </div>
    </div>
  );
};

export default Editor;
