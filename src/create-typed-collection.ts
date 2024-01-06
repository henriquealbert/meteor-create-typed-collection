import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { ZodObject, ZodRawShape, z } from "zod";

type createTypedCollectionParams<
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
> = {
    customCollectionMethods?: U;
    name?: string;
    instance?: Mongo.Collection<any>;
    schema: ZodObject<T>;
};

// Infer the method names and their signatures
type ExtractMethodNames<U extends Record<string, (...args: any[]) => any>> = {
    [K in keyof U]: (...args: Parameters<U[K]>) => ReturnType<U[K]>;
};

type CustomMethods = {
    [methodName: string]: (...args: any[]) => any;
};

function createDbCollection<T extends ZodRawShape>(
    instance?: Mongo.Collection<any>,
    name?: string
): Mongo.Collection<T, T> {
    if (instance && !name) {
        return instance as Mongo.Collection<T, T>;
    }

    if (!name) {
        throw new Meteor.Error(
            "You must provide a name to create a collection"
        );
    }

    if (!instance) {
        return new Mongo.Collection<T, T>(name);
    }

    throw new Error("Unexpected condition: Unable to create the collection");
}

function validateCollectionParams(
    name: string | undefined,
    instance: Mongo.Collection<any> | undefined
): void {
    if (!name && !instance) {
        throw new Meteor.Error(
            "You must provide a name or an instance to create a collection"
        );
    }

    if (name && instance) {
        throw new Meteor.Error(
            "You must provide either a name or an instance to create a collection, but not both"
        );
    }

    if (Meteor.isClient) {
        throw new Meteor.Error("Collections are not allowed on the client");
    }
}

/**
 * Creates a Meteor collection with a specified name and schema.
 *
 * This function initializes a Meteor collection with the given name and schema.
 * Additional properties can be assigned to the collection using the `collection` parameter.
 * The created collection will have the same types as the specified schema.
 *
 * @example
 * const userSchema = z.object({
 *   name: z.string(),
 *   age: z.number()
 * });
 *
 * const customCollectionMethods = {
 *     customMethod() {
 *      return 'customMethod';
 *    },
 * }
 *
 * const UserCollection = createTypedCollection({
 *   name: 'users',
 *   schema: userSchema,
 *   customCollectionMethods,
 * });
 *
 * // Now, `UserCollection` is a Meteor collection named 'users' with properties defined by `userSchema`.
 * // It also includes the additional custom method 'customMethod'.
 *
 */
export function createTypedCollection<
    T extends ZodRawShape,
    U extends Record<string, (...args: any[]) => any>
>({
    customCollectionMethods,
    name,
    schema,
    instance,
}: createTypedCollectionParams<T, U>) {
    try {
        validateCollectionParams(name, instance);

        type SchemaType = z.infer<typeof schema>;
        const dbCollection = createDbCollection<SchemaType>(instance, name);

        // Use mapped types to infer method names and their signatures
        type MethodNames = ExtractMethodNames<U>;

        // Assign custom methods to the collection
        Object.assign(dbCollection, customCollectionMethods);

        return dbCollection as Mongo.Collection<SchemaType, SchemaType> &
            CustomMethods &
            MethodNames;
    } catch (e) {
        console.error(
            `An error has happened when your collection${
                name ? ` "${name}"` : ""
            } was being created.`,
            e
        );
        throw e;
    }
}
