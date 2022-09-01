import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

export interface IDocument {
    title: string;
    content: string;
}

export interface IStoredUserInformation {
    uid: string;
    name: string;
    role: EUserRole;
    authProvider: EAuthProvider;
    email: string;
}

export type ISignedInUser = UserCredential & IStoredUserInformation;

export enum EUserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export const userRoleToString: Record<EUserRole, string> = {
    USER: 'user',
    ADMIN: 'admin',
};

export enum EAuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
}

export const authProviderToString: Record<EAuthProvider, string> = {
    EMAIL: 'email',
    GOOGLE: 'google',
};

export const emptyDocument = { title: '', content: '' } as IDocument;
