export interface IDocument {
    title: string;
    content: string;
}

export interface IUserInformation {
    uId: string,
    name: string,
    role: EUserRole,
    authProvider: EAuthProvider,
    email: string,
}

export enum EUserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum EAuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE'
}

export const emptyDocument = { content: '' } as IDocument;
