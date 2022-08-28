import { initializeApp } from 'firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import {
    EAuthProvider,
    emptyDocument,
    EUserRole,
    IDocument,
    ISignedInUser,
    IStoredUserInformation,
} from './types';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY as string,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_APP_ID as string,
};

const questionsCollection = 'questions';
const usersCollection = 'users';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const createDocument = async (document: IDocument) => {
    const questionsRef = collection(db, questionsCollection);
    await addDoc(questionsRef, document).catch(() => {
        console.log('Something when wrong when saving document:', document);
    });
};

const getDocument = async (documentId: string): Promise<IDocument> => {
    let document = emptyDocument;
    const docRef = doc(db, questionsCollection, documentId);

    await getDoc(docRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                document = snapshot.data() as IDocument;
            }
        })
        .catch(() => {
            console.log('Something went wrong when fetching document with id:', documentId);
        });
    return document;
};

const updateDocument = async (document: IDocument, documentId: string) => {
    const docRef = doc(db, questionsCollection, documentId);

    await updateDoc(docRef, { ...document }).catch(() => {
        console.log('Something went wrong when updating document with id:', documentId);
    });
};

const deleteDocument = async (documentId: string) => {
    const docRef = doc(db, questionsCollection, documentId);

    await deleteDoc(docRef).catch(() => {
        console.log('Something went wrong when deleting document with id:', documentId);
    });
};

const getDocuments = async () => {
    const questionsRef = collection(db, questionsCollection);

    await getDocs(questionsRef).catch(() => {
        console.log('Something went wrong when fetching all documents.');
    });
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password).catch(
        () => {
            console.log(
                'Something went wrong when registering with email and password for user with name:',
                name
            );
        }
    );
    if (!userCredentials) {
        throw new Error(
            `User credentials was ${userCredentials} after registering with email for user with name ${name}`
        );
    }
    const user = userCredentials.user;
    const userInformation = {
        uid: user.uid,
        name: name,
        role: EUserRole.USER,
        authProvider: EAuthProvider.EMAIL,
        email: email,
    } as IStoredUserInformation;

    await addDoc(collection(db, usersCollection), userInformation).catch(() => {
        console.log('Something went wrong when storing user information for user with name:', name);
    });
};

const signInWithGoogle = async () => {
    const userCredentials = await signInWithPopup(auth, googleProvider).catch((e) => {
        console.log('Something went wrong when signing with google:', e);
    });
    if (!userCredentials) {
        throw new Error(
            `User credentials was ${userCredentials} after signing in with google: ${error}`
        );
    }
    const user = { ...userCredentials.user } as unknown as ISignedInUser;
    const q = query(collection(db, usersCollection), where('uid', '==', user.uid));
    const userData = await getDocs(q);
    if (userData.docs.length === 0) {
        const userInformation = {
            uid: user.uid,
            name: user.name,
            role: EUserRole.USER,
            authProvider: EAuthProvider.EMAIL,
            email: user.email,
        } as IStoredUserInformation;

        await addDoc(collection(db, usersCollection), userInformation).catch(() => {
            console.log(
                'Something went wrong when storing user information for user with name:',
                user.name
            );
        });
    }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password).catch((e) => {
        console.log('Something went wrong when signisng in with email:', e);
    });
};

const logOut = async () => {
    await signOut(auth).catch((e) => {
        console.log('Something went wrong when signing out:', e);
    });
};

const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email).catch((e) => {
        console.log(
            `Something went wrong when sending password reset to user with email ${email}. Error: ${e}`
        );
    });
};

export {
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    getDocuments,
    registerWithEmailAndPassword,
    signInWithGoogle,
    logInWithEmailAndPassword,
    logOut,
    sendPasswordReset,
};
