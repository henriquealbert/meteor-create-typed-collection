Package.describe({
    git: "https://github.com/henriquealbert/meteor-create-typed-collection",
    name: "hschmaiske:create-typed-collection",
    version: "0.0.2",
    summary: "Create typed safe collections for Meteor",
    documentation: "README.md",
});

Npm.depends({
    zod: "3.22.4",
});

Package.onUse(function (api) {
    api.versionsFrom("2.13.3", "3.0-beta.0");
    api.use("ecmascript");
    api.use("typescript");
    api.use("zodern:types@1.0.0");
    api.mainModule("src/index.ts");
});
