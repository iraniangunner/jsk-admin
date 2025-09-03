"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Repeat,
  AlignJustify,
  AlignRight,
  AlignCenter,
  AlignLeft,
} from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  dir?: "rtl" | "ltr";
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  dir = "rtl",
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: true }), TextAlign.configure({
      types: ['paragraph', 'heading'], // ⚡ فقط روی پاراگراف و تیترها اعمال می‌شود
    }),],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
    editorProps: { attributes: { dir } },
  });

  // ⚡ هر بار value تغییر کند، editor به‌روز می‌شود
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolbarButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }> = ({ onClick, active, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${active ? "bg-gray-200" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded-md bg-white">
    {/* Toolbar */}
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
      {/* Text styles */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      {/* Links */}
      <ToolbarButton
        onClick={() => {
          const url = prompt("Enter link URL");
          if (url)
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
        }}
        active={editor.isActive("link")}
      >
        <LinkIcon size={16} />
      </ToolbarButton>

      {/* Undo / Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
        <Repeat size={16} />
      </ToolbarButton>

      {/* Text Align */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
      >
        <AlignRight size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
      >
        <AlignJustify size={16} />
      </ToolbarButton>
    </div>

    {/* Editor content */}
    <div className="p-[30px] min-h-[150px] focus:outline-none focus:outline-0 border-0">
      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-full focus:outline-none"
      />
    </div>
  </div>
  );
};
