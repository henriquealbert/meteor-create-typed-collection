# Meteor Create Typed Collection

The Meteor Typed Collection package simplifies the creation of Meteor collections in TypeScript, integrating seamlessly with Zod for schema validation. This utility allows you to define a collection with a specified name and schema, including custom methods, providing a type-safe and structured approach to working with collections in a Meteor project.


## How it works
The `createTypedCollection` function is at the core of this package. It takes a `ZodObject` representing the anticipated shape of your collection documents and optional custom methods. The resulting Meteor collection is enriched with custom methods and adheres to the specified schema.


## Usage

1. Installation: Make sure to install the necessary dependencies, including Zod and your Meteor Typed Collection package.

```bash
meteor npm i zod create-typed-collection
```

2. Import the function: Import the createTypedCollection function into your TypeScript file.
```typescript
import { createTypedCollection } from "create-typed-collection";
```

3. Define your ZodObject for the collection schema: Create a ZodObject that represents the expected structure of your collection documents.

```typescript
const schema = z.object({
  name: z.string(),
  age: z.number(),
  hobbies: z.array(z.string()),
});
```

4. Define your custom methods: Create an object with the custom methods you want to add to your collection. The methods will be added to the collection as static methods.

```typescript
const customCollectionMethods = {
  async getPeopleWithHobby(hobby: string) {
    return People.find({ hobbies: hobby }).fetchAsync();
  },
};
```

5. Create the Typed Collection: Call the createTypedCollection function with the name of your collection and the ZodObject representing the schema. The function returns a Meteor collection that adheres to the specified schema.

```typescript
const People = createTypedCollection({
  name: "people",
  schema,
  customCollectionMethods
});
```

6. Use the Typed Collection: You can now use the collection as you would any other Meteor collection. The collection documents will be type-safe and the custom methods will be available on the collection.

```typescript
await People.insertAsync({ name: "John", age: 30, hobbies: ["hiking", "biking"] });

const peopleWithHikingHobby = await People.getPeopleWithHobby("hiking");
```

7. Enjoy the benefits of type-safety: If you try to insert a document that does not adhere to the specified schema, you will get a TypeScript error. If you try to call a custom method that does not exist on the collection, you will get a TypeScript error.

Optional: You can also use the createTypedCollection function with an existing Meteor collection. This can be useful if you want to add custom methods to an existing collection. The function will return a Meteor collection that adheres to the specified schema and includes the custom methods.

```typescript
const Users = createTypedCollection({
  instance: Meteor.users,
  schema,
  customCollectionMethods
})
```

## API

#### Options

| Name | Type | Description | Required |
| --- | --- | --- | --- |
| name | string | The name of the collection. | Required if instance is not provided. |
| schema | ZodObject | The ZodObject representing the schema of the collection documents. | Required. |
| customCollectionMethods | object | An object with custom methods to add to the collection. | Optional. |
| instance | Mongo.Collection | An existing Meteor collection to add custom methods to. | Optional. |


#### Returns

A Meteor collection that adheres to the specified schema and includes the custom methods.

