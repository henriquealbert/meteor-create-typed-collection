import { MongoInternals } from "meteor/mongo";
import { z } from "zod";

const paramsSchema = z.object({
    mongoUrl: z.string(),
});

export function newRemoteCollectionDriver(
    params: Zod.infer<typeof paramsSchema>
) {
    const { mongoUrl } = paramsSchema.parse(params);

    // @ts-ignore
    return new MongoInternals.RemoteCollectionDriver(mongoUrl);
}
