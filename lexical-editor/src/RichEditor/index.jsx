import React, { useImperativeHandle } from 'react';
import { $generateNodesFromDOM } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot } from 'lexical';

import HtmlPlugin from './plugins/HtmlPlugin';
import MyOnChangePlugin from './plugins/MyOnChangePlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import ExampleTheme from './themes/EditorTheme';
import PlaygroundNodes from './nodes/PlaygroundNodes';

import './index.css';

function RichEditor(props, ref) {
    const { placeholder, value, onError, onChange } = props;
    const htmlPluginRef = React.createRef();

    function initEditorState(editor) {
        const rootNode = $getRoot();

        if (value?.length > 0) {
            const parser = new DOMParser();
            const htmlString = value;
            const dom = parser.parseFromString(htmlString, 'text/html');

            const nodes = $generateNodesFromDOM(editor, dom);

            for (let i = 0; i < nodes.length; ++i) {
                const node = nodes[i];

                try {
                    rootNode.append(node);
                } catch (err) {
                    continue;
                }
            }
        }

        return rootNode;
    }

    const exportHtml = () => {
        const htmlString = htmlPluginRef.current.exportHtml();

        return htmlString;
    };

    useImperativeHandle(ref, () => ({
        exportHtml,
    }));

    const initialConfig = {
        editorState: initEditorState,
        namespace: 'MyEditor',
        nodes: [...PlaygroundNodes],
        theme: ExampleTheme,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <div className='editor-container'>
                <div className='editor-scroller'>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className='ContentEditable__root'
                                aria-placeholder={placeholder}
                                placeholder={<div className='ContentEditable__placeholder'>{placeholder}</div>}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <HtmlPlugin ref={htmlPluginRef} />
                </div>
            </div>
            <TreeViewPlugin />
            <MyOnChangePlugin onChange={onChange} />
        </LexicalComposer>
    );
}

export default React.forwardRef(RichEditor);
