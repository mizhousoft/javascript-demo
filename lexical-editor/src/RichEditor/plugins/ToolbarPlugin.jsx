import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $findMatchingParent,
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
    $isEditorIsNestedEditor,
    mergeRegister,
} from '@lexical/utils';
import {
    $createParagraphNode,
    $getNodeByKey,
    $getRoot,
    $getSelection,
    $isElementNode,
    $isRangeSelection,
    $isRootOrShadowRoot,
    $isTextNode,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_NORMAL,
    ElementFormatType,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    INDENT_CONTENT_COMMAND,
    KEY_MODIFIER_COMMAND,
    LexicalEditor,
    NodeKey,
    OUTDENT_CONTENT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import {
    $isListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
} from '@lexical/list';
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
    HeadingTagType,
} from '@lexical/rich-text';
import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $patchStyleText,
    $setBlocksType,
} from '@lexical/selection';
import {
    $createCodeNode,
    $isCodeNode,
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    CODE_LANGUAGE_MAP,
    getLanguageFriendlyName,
} from '@lexical/code';
import DropDown, { DropDownItem } from '../ui/DropDown';
import { getSelectedNode } from '../util/getSelectedNode';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

const LowPriority = 1;

const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
};

function dropDownActiveClass(active) {
    if (active) {
        return 'active dropdown-item-active';
    }
    return '';

}

function BlockFormatDropDown({
    editor,
    blockType,
    rootType,
    disabled = false,
}) {
    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    const formatHeading = (headingSize) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();
                $setBlocksType(selection, () => $createHeadingNode(headingSize));
            });
        }
    };

    console.log(blockType)
    const formatBulletList = () => {
        if (blockType !== 'bullet') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
            formatParagraph();
        }
    };

    const formatCheckList = () => {
        if (blockType !== 'check') {
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        } else {
            formatParagraph();
        }
    };

    const formatNumberedList = () => {
        if (blockType !== 'number') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
            formatParagraph();
        }
    };

    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = $getSelection();
                $setBlocksType(selection, () => $createQuoteNode());
            });
        }
    };

    const formatCode = () => {
        if (blockType !== 'code') {
            editor.update(() => {
                let selection = $getSelection();

                if (selection !== null) {
                    if (selection.isCollapsed()) {
                        $setBlocksType(selection, () => $createCodeNode());
                    } else {
                        const textContent = selection.getTextContent();
                        const codeNode = $createCodeNode();
                        selection.insertNodes([codeNode]);
                        selection = $getSelection();
                        if ($isRangeSelection(selection)) {
                            selection.insertRawText(textContent);
                        }
                    }
                }
            });
        }
    };

    return (
        <DropDown
            disabled={disabled}
            buttonClassName="toolbar-item block-controls"
            buttonIconClassName={`icon block-type ${blockType}`}
            buttonLabel={blockTypeToBlockName[blockType]}
            buttonAriaLabel="Formatting options for text style">
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'paragraph')}`}
                onClick={formatParagraph}>
                <i className="icon paragraph" />
                <span className="text">Normal</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'h1')}`}
                onClick={() => formatHeading('h1')}>
                <i className="icon h1" />
                <span className="text">Heading 1</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'h2')}`}
                onClick={() => formatHeading('h2')}>
                <i className="icon h2" />
                <span className="text">Heading 2</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'h3')}`}
                onClick={() => formatHeading('h3')}>
                <i className="icon h3" />
                <span className="text">Heading 3</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'bullet')}`}
                onClick={formatBulletList}>
                <i className="icon bullet-list" />
                <span className="text">Bullet List</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'number')}`}
                onClick={formatNumberedList}>
                <i className="icon numbered-list" />
                <span className="text">Numbered List</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'check')}`}
                onClick={formatCheckList}>
                <i className="icon check-list" />
                <span className="text">Check List</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'quote')}`}
                onClick={formatQuote}>
                <i className="icon quote" />
                <span className="text">Quote</span>
            </DropDownItem>
            <DropDownItem
                className={`item ${dropDownActiveClass(blockType === 'code')}`}
                onClick={formatCode}>
                <i className="icon code" />
                <span className="text">Code Block</span>
            </DropDownItem>
        </DropDown>
    );
}

function Divider() {
    return <div className='divider' />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [blockType, setBlockType] =
        useState('paragraph');
    const [rootType, setRootType] =
        useState('root');
    const [isImageCaption, setIsImageCaption] = useState(false);
    const [isRTL, setIsRTL] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [selectedElementKey, setSelectedElementKey] = useState(
        null,
    );
    const [fontColor, setFontColor] = useState('#000');
    const [bgColor, setBgColor] = useState('#fff');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [elementFormat, setElementFormat] = useState('left');
    const [isSubscript, setIsSubscript] = useState(false);
    const [isSuperscript, setIsSuperscript] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [fontSize, setFontSize] = useState('15px');
    const [codeLanguage, setCodeLanguage] = useState('');

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
                const rootElement = activeEditor.getRootElement();
                setIsImageCaption(
                    !!rootElement?.parentElement?.classList.contains(
                        'image-caption-container',
                    ),
                );
            } else {
                setIsImageCaption(false);
            }

            const anchorNode = selection.anchor.getNode();
            let element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : $findMatchingParent(anchorNode, (e) => {
                        const parent = e.getParent();
                        return parent !== null && $isRootOrShadowRoot(parent);
                    });

            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow();
            }

            const elementKey = element.getKey();
            const elementDOM = activeEditor.getElementByKey(elementKey);

            setIsRTL($isParentElementRTL(selection));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }

            const tableNode = $findMatchingParent(node, $isTableNode);
            if ($isTableNode(tableNode)) {
                setRootType('table');
            } else {
                setRootType('root');
            }

            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(
                        anchorNode,
                        ListNode,
                    );
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                    if ($isCodeNode(element)) {
                        const language =
                            element.getLanguage();
                        setCodeLanguage(
                            language ? CODE_LANGUAGE_MAP[language] || language : '',
                        );
                        return;
                    }
                }
            }
            // Handle buttons
            setFontColor(
                $getSelectionStyleValueForProperty(selection, 'color', '#000'),
            );
            setBgColor(
                $getSelectionStyleValueForProperty(
                    selection,
                    'background-color',
                    '#fff',
                ),
            );
            setFontFamily(
                $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
            );
            let matchingParent;
            if ($isLinkNode(parent)) {
                // If node is a link, we need to fetch the parent paragraph node to set format
                matchingParent = $findMatchingParent(
                    node,
                    (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
                );
            }

            // If matchingParent is a valid node, pass it's format type
            setElementFormat(
                $isElementNode(matchingParent)
                    ? matchingParent.getFormatType()
                    : $isElementNode(node)
                        ? node.getFormatType()
                        : parent?.getFormatType() || 'left',
            );
        }
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));
            setIsCode(selection.hasFormat('code'));

            setFontSize(
                $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
            );
        }
    }, [activeEditor, editor]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                setActiveEditor(newEditor);
                $updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar]);

    useEffect(() => {
        activeEditor.getEditorState().read(() => {
            $updateToolbar();
        });
    }, [activeEditor, $updateToolbar]);

    useEffect(
        () =>
            mergeRegister(
                editor.registerUpdateListener(({ editorState }) => {
                    editorState.read(() => {
                        $updateToolbar();
                    });
                }),
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    (_payload, _newEditor) => {
                        $updateToolbar();
                        return false;
                    },
                    LowPriority
                ),
                editor.registerCommand(
                    CAN_UNDO_COMMAND,
                    (payload) => {
                        setCanUndo(payload);
                        return false;
                    },
                    LowPriority
                ),
                editor.registerCommand(
                    CAN_REDO_COMMAND,
                    (payload) => {
                        setCanRedo(payload);
                        return false;
                    },
                    LowPriority
                )
            ),
        [editor, $updateToolbar]
    );

    useEffect(() => editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
            setActiveEditor(newEditor);
            $updateToolbar();
            return false;
        },
        COMMAND_PRIORITY_CRITICAL
    ), [editor, $updateToolbar]);

    useEffect(() => {
        activeEditor.getEditorState().read(() => {
            $updateToolbar();
        });
    }, [activeEditor, $updateToolbar]);

    return (
        <div className='toolbar' ref={toolbarRef}>
            <button
                type='button'
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className='toolbar-item spaced'
                aria-label='Undo'
            >
                <i className='format undo' />
            </button>
            <button
                type='button'
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className='toolbar-item'
                aria-label='Redo'
            >
                <i className='format redo' />
            </button>
            <Divider />
            <BlockFormatDropDown
                blockType={blockType}
                rootType={rootType}
                editor={activeEditor}
            />
            <Divider />
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={`toolbar-item spaced ${isBold ? 'active' : ''}`}
                aria-label='Format Bold'
            >
                <i className='format bold' />
            </button>
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={`toolbar-item spaced ${isItalic ? 'active' : ''}`}
                aria-label='Format Italics'
            >
                <i className='format italic' />
            </button>
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={`toolbar-item spaced ${isUnderline ? 'active' : ''}`}
                aria-label='Format Underline'
            >
                <i className='format underline' />
            </button>
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                className={`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`}
                aria-label='Format Strikethrough'
            >
                <i className='format strikethrough' />
            </button>
            <Divider />
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                className='toolbar-item spaced'
                aria-label='Left Align'
            >
                <i className='format left-align' />
            </button>
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                className='toolbar-item spaced'
                aria-label='Center Align'
            >
                <i className='format center-align' />
            </button>
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                className='toolbar-item spaced'
                aria-label='Right Align'
            >
                <i className='format right-align' />
            </button>
            <button
                type='button'
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                className='toolbar-item'
                aria-label='Justify Align'
            >
                <i className='format justify-align' />
            </button>{' '}
        </div>
    );
}
