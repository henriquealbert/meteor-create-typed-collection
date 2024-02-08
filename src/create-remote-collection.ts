import { Meteor } from "meteor/meteor";
import { createTypedCollection } from "./create-typed-collection";
import { CreateRemoteCollectionParams } from "./types";
import { ZodRawShape } from "zod";

export const createRemoteCollection = <
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
>({
    name,
    schema,
    customCollectionMethods,
    _driver,
    stackName,
}: CreateRemoteCollectionParams<T, U>) => {
    if (Meteor.isClient) {
        throw Error(`${stackName}Connection should be used only in the server`);
    }

    console.info(`connection established with ${stackName} - ${name}`);

    return createTypedCollection({
        schema,
        _driver,
        customCollectionMethods,
        name,
    });
};
