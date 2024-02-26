Package.describe({
    git: "https://github.com/henriquealbert/meteor-create-typed-collection",
    name: "hschmaiske:create-typed-collection",
    version: "1.0.1",
    summary: "Create typed safe collections for Meteor",
    documentation: "README.md",
});

Npm.depends({
    zod: "3.22.4",
});

Package.onUse(function (api) {
    api.versionsFrom(["2.13.3", "3.0-beta.4"]);
    api.use("ecmascript");
    api.use(["typescript@3.0.0||4.0.0||5.0.0||6.0.0||7.0.0||5.3.3-beta300.4"]);
    api.use("zodern:types@1.0.0");
    api.use("mongo");
    api.mainModule("src/index.ts");
});
