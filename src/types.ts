import { ZodObject, ZodRawShape } from "zod";
import { Mongo } from "meteor/mongo";

export type CreateTypedCollectionParams<
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
> = {
    customCollectionMethods?: U;
    name?: string;
    instance?: Mongo.Collection<any>;
    schema: ZodObject<T>;
    _driver?: any;
};

export type CreateRemoteCollectionParams<
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
> = {
    stackName: string;
    customCollectionMethods?: U;
    name: string;
    schema: ZodObject<T>;
    _driver?: any;
};

export type CreateRemoteTypedCollection<
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
> = {
    mongoUrl: string;
    stackName: string;
    customCollectionMethods?: U;
    name: string;
    schema: ZodObject<T>;
};

export type ExtractMethodNames<
    U extends Record<string, (...args: any[]) => any>
> = {
    [K in keyof U]: (...args: Parameters<U[K]>) => ReturnType<U[K]>;
};

export type CustomMethods = {
    [methodName: string]: (...args: any[]) => any;
};

export type CreateDbCollectionParams = {
    instance?: Mongo.Collection<any>;
    name?: string;
    _driver?: any;
};
