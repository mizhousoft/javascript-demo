import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import EditorDemo from './EditorDemo';

const container = document.getElementById('root');

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <EditorDemo />
    </React.StrictMode>
);
