/* eslint-disable react/prop-types */
import {
    MDXEditor,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    linkPlugin,
    linkDialogPlugin,
    CreateLink,
    InsertImage,
    InsertTable,
    tablePlugin,
    imagePlugin,
    BlockTypeSelect,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    headingsPlugin,
    quotePlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

function CourseMDXEditor({ setDescription, markdown = '' }) {
    // async function imageUploadHandler(image) {
    //     const formData = new FormData();
    //     formData.append('image', image);
    //     // send the file to your server and return
    //     // the URL of the uploaded image in the response
    //     const response = await fetch('/uploads/new', {
    //         method: 'POST',
    //         body: formData,
    //     });
    //     const json = await response.json();
    //     return json.url;
    // }

    return (
        <MDXEditor
            markdown={markdown}
            placeholder={'Nhập mô tả khóa học'}
            onChange={(markdown) => setDescription(markdown)}
            contentEditableClassName="min-h-[360px] border rounded"
            plugins={[
                linkPlugin(),
                tablePlugin(),
                headingsPlugin(),
                quotePlugin(),
                imagePlugin({
                    imageUploadHandler: () => {
                        return Promise.resolve('https://picsum.photos/200/300');
                    },
                    imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200'],
                }),
                linkDialogPlugin({
                    linkAutocompleteSuggestions: ['https://virtuoso.dev', 'https://mdxeditor.dev'],
                }),
                diffSourcePlugin({ diffMarkdown: 'An older version', viewMode: 'rich-text' }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <InsertImage />
                            <InsertTable />
                            <CreateLink />
                            <DiffSourceToggleWrapper>
                                <UndoRedo />
                            </DiffSourceToggleWrapper>
                        </>
                    ),
                }),
            ]}
        />
    );
}

export default CourseMDXEditor;
