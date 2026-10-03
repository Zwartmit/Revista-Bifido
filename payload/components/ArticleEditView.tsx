'use client';

import React from 'react';
import { DefaultEditView } from '@payloadcms/ui';
import type { DocumentViewClientProps } from 'payload';

/**
 * ArticleEditView — Custom wrapper for the article edit screen.
 *
 * We render Payload's DefaultEditView (which handles the form, save buttons,
 * auth, etc.) inside a container that we fully control. Then we use
 * admin-custom.css to rearrange the fields visually via CSS Grid.
 */
export function ArticleEditView(props: DocumentViewClientProps) {
    return (
        <div className="bifido-article-editor">
            <DefaultEditView {...props} />
        </div>
    );
}

export default ArticleEditView;
