import React from 'react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import {
    EditorProvider, useCurrentEditor, BubbleMenu,
    EditorContent,
    FloatingMenu, useEditor,

} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import './index.less';
import MenuBar from './MenuBar';

export default function RichEditor({ content }) {

    const extensions = [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
        }),
    ];

    const editor = useEditor({
        extensions: extensions,
        content: content,
    })

    return <>
        <MenuBar editor={editor} />

        {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bubble-menu">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    Strike
                </button>
            </div>
        </BubbleMenu>}

        <EditorContent editor={editor} />
    </>;
} 
