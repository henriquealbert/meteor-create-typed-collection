import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { ZodRawShape, z } from "zod";
import type {
    CreateDbCollectionParams,
    CreateTypedCollectionParams,
    CustomMethods,
    ExtractMethodNames,
} from "./types";

const createDbCollection = <T extends ZodRawShape>({
    _driver,
    instance,
    name,
}: CreateDbCollectionParams) => {
    if (instance && !name && !_driver) {
        return instance as Mongo.Collection<T, T>;
    }

    if (!name) {
        throw new Meteor.Error(
            "You must provide a name to create a collection"
        );
    }

    if (!instance && !_driver) {
        return new Mongo.Collection<T, T>(name);
    }

    if (!instance && _driver) {
        return new Mongo.Collection<T, T>(name, {
            // @ts-ignore
            _driver,
            _suppressSameNameError: true,
            defineMutationMethods: false,
        });
    }

    throw new Error("Unexpected condition: Unable to create the collection");
};

function validateCollectionParams(
    name?: string,
    instance?: Mongo.Collection<any>
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
    _driver,
}: CreateTypedCollectionParams<T, U>) {
    try {
        validateCollectionParams(name, instance);

        type SchemaType = z.infer<typeof schema>;
        const dbCollection = createDbCollection<SchemaType>({
            instance,
            name,
            _driver,
        });

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
