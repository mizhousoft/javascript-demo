import React, { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function MyOnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();

    useEffect(
        () =>
            editor.registerUpdateListener(({ editorState }) => {
                onChange(editor, editorState);
            }),
        [editor, onChange]
    );

    return null;
}
