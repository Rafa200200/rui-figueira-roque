"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading2, Undo, Redo } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 text-foreground bg-transparent',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) return null

    return (
        <div className="flex flex-col border border-foreground/20 rounded-md overflow-hidden bg-background">
            <div className="flex flex-wrap items-center gap-1 border-b border-foreground/20 bg-foreground/5 p-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-foreground/10 text-brand-dark' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-foreground/10 text-brand-dark' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-foreground/20 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-foreground/10 text-brand-dark' : ''}`}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-foreground/20 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-foreground/10 text-brand-dark' : ''}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-foreground/10 text-brand-dark' : ''}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-4 bg-foreground/20 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            <EditorContent editor={editor} className="cursor-text" onClick={() => editor.commands.focus()} />
        </div>
    )
}
