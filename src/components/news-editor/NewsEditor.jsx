import React, { useState, useEffect } from 'react'

import { EditorState, convertToRaw, ContentState } from 'draft-js';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function NewsEditor(props) {

    useEffect(() => {
        // props.content为undefined 说明此时NewsAdd为父组件，没给本组件传content
        if (props.content === undefined) return
        const contentBlock = htmlToDraft(props.content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorFatherState = EditorState.createWithContent(contentState);
            setEditorState(editorFatherState)
        }
    }, [props.content])

    const [editorState, setEditorState] = useState('')
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
