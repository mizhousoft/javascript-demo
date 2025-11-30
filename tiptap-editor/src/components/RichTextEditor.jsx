// components/RichTextEditor.jsx
import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

// 工具栏组件
import Toolbar from './Toolbar';
import './RichTextEditor.css';

const RichTextEditor = ({
    content = '',
    onChange,
    placeholder = '开始输入内容...',
    editable = true
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html, editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose focus:outline-none max-w-none',
                placeholder: placeholder,
            },
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt('请输入图片URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('请输入链接URL:', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="rich-text-editor">
            <Toolbar
                editor={editor}
                onAddImage={addImage}
                onSetLink={setLink}
            />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;