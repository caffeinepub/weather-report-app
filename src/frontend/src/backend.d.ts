import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Request {
    to: Principal;
    status: Variant_pending_completed_rejected;
    requestId: string;
    contactName?: string;
    from: Principal;
    description: string;
    timestamp: bigint;
    amount: bigint;
}
export interface AccountInfo {
    maskedAccountNumber: string;
    principal: Principal;
    balance: bigint;
}
export interface Contact {
    name: string;
    contactPrincipal: Principal;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    to: Principal;
    status: Variant_cancelled_pending_completed;
    contactName?: string;
    transactionType: Variant_sent_requestReceived_received_requestSent;
    from: Principal;
    description: string;
    timestamp: bigint;
    amount: bigint;
    transactionId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_cancelled_pending_completed {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed"
}
export enum Variant_pending_completed_rejected {
    pending = "pending",
    completed = "completed",
    rejected = "rejected"
}
export enum Variant_sent_requestReceived_received_requestSent {
    sent = "sent",
    requestReceived = "requestReceived",
    received = "received",
    requestSent = "requestSent"
}
export interface backendInterface {
    addContact(name: string, contactPrincipal: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAccountInfo(): Promise<AccountInfo>;
    getAllContacts(): Promise<Array<Contact>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContact(name: string): Promise<Contact | null>;
    getContactByPrincipal(principal: Principal): Promise<Contact | null>;
    getRequests(): Promise<Array<Request>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    requestMoney(to: Principal, amount: bigint, description: string, contactName: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMoney(to: Principal, amount: bigint, description: string, contactName: string | null): Promise<void>;
}
