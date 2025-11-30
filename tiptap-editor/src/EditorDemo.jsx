// components/EditorDemo.jsx
import React, { useState } from 'react';
import RichTextEditor from './components/RichTextEditor';

const EditorDemo = () => {
    const [content, setContent] = useState('<p>欢迎使用富文本编辑器！</p>');
    const [isEditable, setIsEditable] = useState(true);

    const initialContent = `
    <h2>功能演示</h2>
    <p>这是一个基于 <strong>Tiptap 3.11</strong> 的富文本编辑器</p>
    <ul>
      <li>支持文本格式化</li>
      <li>表格和列表</li>
      <li>图片和链接</li>
      <li>任务列表</li>
    </ul>
  `;

    return (
        <div className="editor-demo">
            <div className="demo-controls">
                <button
                    onClick={() => setContent(initialContent)}
                    className="control-button"
                >
                    加载示例内容
                </button>

                <button
                    onClick={() => setContent('')}
                    className="control-button"
                >
                    清空内容
                </button>

                <label className="control-checkbox">
                    <input
                        type="checkbox"
                        checked={isEditable}
                        onChange={(e) => setIsEditable(e.target.checked)}
                    />
                    可编辑
                </label>

                <button
                    onClick={() => console.log('HTML:', content)}
                    className="control-button"
                >
                    输出HTML到控制台
                </button>
            </div>

            <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="开始输入您的内容..."
                editable={isEditable}
            />

            <div className="content-preview">
                <h3>实时预览：</h3>
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    className="preview-content"
                />
            </div>
        </div>
    );
};

export default EditorDemo;