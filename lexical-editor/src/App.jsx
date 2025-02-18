import React from 'react';

import RichEditor from './RichEditor';

export default function App() {
    const editorRef = React.createRef(undefined);

    function onError(error) {
        console.error(error);
    }

    function onChange(editorState) { }

    const exportHtml = () => {
        const htmlString = editorRef.current.exportHtml();
        console.log(htmlString);
    };

    const htmlString = `<p class="editor-paragraph" dir="ltr">
  <span style="white-space: pre-wrap;">paragraph</span>
</p>
<p class="editor-paragraph" dir="ltr">
  <b>
    <strong class="editor-text-bold" style="white-space: pre-wrap;">heading</strong>
  </b>
</p>
<p class="editor-paragraph" dir="ltr">
  <span style="white-space: pre-wrap;">quote</span>
</p>
<p class="editor-paragraph" dir="ltr" style="padding-inline-start: 80px;">
  <span style="white-space: pre-wrap;">paragraph</span>
</p>
<p class="editor-paragraph" dir="ltr">
  <span style="white-space: pre-wrap;">heading</span>
</p>
<p class="editor-paragraph" dir="ltr">
  <span style="white-space: pre-wrap;">quote</span>
</p>`;

    return (
        <>
            <div style={{ position: 'fixed', left: 10, top: 50 }}>
                <button type='button' onClick={exportHtml}>
                    Export Html
                </button>
            </div>

            <div className="editor-shell">
                <RichEditor ref={editorRef} placeholder='Enter some rich text...' value={htmlString} onError={onError} onChange={onChange} />
            </div>
        </>
    );
}
