import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Content {
    live: string;
    notes: string;
    recorded: Array<string>;
    questions: Array<Question>;
}
export interface ChatMessage {
    role: string;
    text: string;
    timestamp: Time;
    senderName: string;
}
export interface Submission {
    studentName: string;
    subject: Subject;
    score: bigint;
    classType: ClassType;
}
export interface Question {
    question: string;
    correctAnswerIndex: bigint;
    options: Array<string>;
}
export enum ClassType {
    six = "six",
    seven = "seven"
}
export enum Subject {
    maths = "maths",
    science = "science"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatMessage(classType: ClassType, subject: Subject, senderName: string, role: string, text: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(classType: ClassType, subject: Subject): Promise<Array<ChatMessage>>;
    getClassContent(classType: ClassType, subject: Subject): Promise<Content>;
    getGooglePayQrBlob(): Promise<ExternalBlob | null>;
    getTestSubmission(studentName: string, classType: ClassType, subject: Subject): Promise<Submission | null>;
    isCallerAdmin(): Promise<boolean>;
    submitTest(studentName: string, classType: ClassType, subject: Subject, score: bigint): Promise<void>;
    updateClassContent(classType: ClassType, subject: Subject, live: string, recorded: Array<string>, notes: string, questions: Array<Question>): Promise<void>;
    updateGooglePayQrBlob(blob: ExternalBlob): Promise<void>;
}
