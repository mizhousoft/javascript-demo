// components/Toolbar.jsx
import React from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Quote, Undo, Redo,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Table, Image, Link, CheckSquare
} from 'lucide-react';

const Toolbar = ({ editor, onAddImage, onSetLink }) => {
    if (!editor) {
        return null;
    }

    const menuItems = [
        // 文本样式
        {
            icon: Bold,
            title: '加粗 (Ctrl+B)',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: Italic,
            title: '斜体 (Ctrl+I)',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: Underline,
            title: '下划线 (Ctrl+U)',
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: () => editor.isActive('underline'),
        },
        {
            icon: Strikethrough,
            title: '删除线',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },

        // 段落格式
        {
            type: 'divider',
        },
        {
            type: 'select',
            title: '段落格式',
            options: [
                { value: 'paragraph', label: '正文' },
                { value: 'h1', label: '标题 1' },
                { value: 'h2', label: '标题 2' },
                { value: 'h3', label: '标题 3' },
                { value: 'h4', label: '标题 4' },
                { value: 'h5', label: '标题 5' },
                { value: 'h6', label: '标题 6' },
                { value: 'blockquote', label: '引用' },
            ],
            onChange: (value) => {
                if (value === 'paragraph') {
                    editor.chain().focus().setParagraph().run();
                } else if (value === 'blockquote') {
                    editor.chain().focus().toggleBlockquote().run();
                } else {
                    const level = parseInt(value.replace('h', ''));
                    editor.chain().focus().toggleHeading({ level }).run();
                }
            },
            value: () => {
                if (editor.isActive('heading', { level: 1 })) return 'h1';
                if (editor.isActive('heading', { level: 2 })) return 'h2';
                if (editor.isActive('heading', { level: 3 })) return 'h3';
                if (editor.isActive('heading', { level: 4 })) return 'h4';
                if (editor.isActive('heading', { level: 5 })) return 'h5';
                if (editor.isActive('heading', { level: 6 })) return 'h6';
                if (editor.isActive('blockquote')) return 'blockquote';
                return 'paragraph';
            },
        },

        // 对齐方式
        {
            type: 'divider',
        },
        {
            icon: AlignLeft,
            title: '左对齐',
            action: () => editor.chain().focus().setTextAlign('left').run(),
            isActive: () => editor.isActive({ textAlign: 'left' }),
        },
        {
            icon: AlignCenter,
            title: '居中对齐',
            action: () => editor.chain().focus().setTextAlign('center').run(),
            isActive: () => editor.isActive({ textAlign: 'center' }),
        },
        {
            icon: AlignRight,
            title: '右对齐',
            action: () => editor.chain().focus().setTextAlign('right').run(),
            isActive: () => editor.isActive({ textAlign: 'right' }),
        },
        {
            icon: AlignJustify,
            title: '两端对齐',
            action: () => editor.chain().focus().setTextAlign('justify').run(),
            isActive: () => editor.isActive({ textAlign: 'justify' }),
        },

        // 列表
        {
            type: 'divider',
        },
        {
            icon: List,
            title: '无序列表',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: ListOrdered,
            title: '有序列表',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: CheckSquare,
            title: '任务列表',
            action: () => editor.chain().focus().toggleTaskList().run(),
            isActive: () => editor.isActive('taskList'),
        },

        // 表格
        {
            type: 'divider',
        },
        {
            icon: Table,
            title: '插入表格',
            action: () => editor.chain().focus().insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true
            }).run(),
        },

        // 媒体
        {
            type: 'divider',
        },
        {
            icon: Image,
            title: '插入图片',
            action: onAddImage,
        },
        {
            icon: Link,
            title: '插入链接',
            action: onSetLink,
            isActive: () => editor.isActive('link'),
        },

        // 操作
        {
            type: 'divider',
        },
        {
            icon: Undo,
            title: '撤销',
            action: () => editor.chain().focus().undo().run(),
            disabled: () => !editor.can().undo(),
        },
        {
            icon: Redo,
            title: '重做',
            action: () => editor.chain().focus().redo().run(),
            disabled: () => !editor.can().redo(),
        },
    ];

    return (
        <div className="toolbar">
            {menuItems.map((item, index) => {
                if (item.type === 'divider') {
                    return <div key={index} className="toolbar-divider" />;
                }

                if (item.type === 'select') {
                    const currentValue = item.value ? item.value() : '';
                    return (
                        <select
                            key={index}
                            title={item.title}
                            value={currentValue}
                            onChange={(e) => item.onChange(e.target.value)}
                            className="toolbar-select"
                        >
                            {item.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    );
                }

                const IconComponent = item.icon;
                const isActive = item.isActive ? item.isActive() : false;
                const isDisabled = item.disabled ? item.disabled() : false;

                return (
                    <button
                        key={index}
                        type="button"
                        title={item.title}
                        onClick={item.action}
                        disabled={isDisabled}
                        className={`toolbar-button ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                    >
                        <IconComponent size={18} />
                    </button>
                );
            })}

            {/* 颜色选择器 */}
            <input
                type="color"
                onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                title="文字颜色"
                className="toolbar-color"
            />
        </div>
    );
};

export default Toolbar;