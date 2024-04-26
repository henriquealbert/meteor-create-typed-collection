import { newRemoteCollectionDriver } from "./new-remote-collection-driver";
import { ZodRawShape } from "zod";
import { createRemoteCollection } from "./create-remote-collection";
import { CreateRemoteTypedCollection } from "./types";

export const createRemoteTypedCollection = <
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
>({
    mongoUrl,
    schema,
    stackName,
    customCollectionMethods,
    name,
}: CreateRemoteTypedCollection<T, U>) => {
    const _driver = newRemoteCollectionDriver({ mongoUrl });

    const collection = createRemoteCollection({
        name,
        schema,
        customCollectionMethods,
        _driver,
        stackName,
    });

    return collection;
};
