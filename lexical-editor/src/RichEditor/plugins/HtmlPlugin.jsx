import React, { useImperativeHandle } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function HtmlPlugin(props, ref) {
    const [editor] = useLexicalComposerContext();

    const exportHtml = () => {
        let htmlString = '';

        const editorState = editor.getEditorState();
        editorState.read(() => {
            htmlString = $generateHtmlFromNodes(editor);
        });

        return htmlString;
    };

    useImperativeHandle(ref, () => ({
        exportHtml,
    }));

    return null;
}

export default React.forwardRef(HtmlPlugin);
