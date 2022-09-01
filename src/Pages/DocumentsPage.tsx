import { FC, useEffect, useState } from 'react';
import '../App.css';
import { getDocument } from '../firebase/firebase';
import { emptyDocument } from '../firebase/types';

const DocumentsPage: FC = () => {
    const [document, setDocument] = useState(emptyDocument);
    const documentId = 'ncCzxMcv8iGgMeDMIXrp';

    useEffect(() => {
        getDocument(documentId).then((document) => setDocument(document));
    }, []);

    return (
        <div>
            <p>{document.title ? document.title : 'Error:'}</p>
            <p>
                {document.content ? document.content : 'Documents was not fetched from Firestore'}
            </p>
        </div>
    );
};

export default DocumentsPage;
