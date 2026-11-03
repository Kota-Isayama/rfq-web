module.exports = {
  schemaFile: "http://127.0.0.1:8001/openapi.json",

  apiFile: "./src/app/api/baseApi.ts",
  apiImport: "baseApi",

  outputFile: "./src/app/api/generatedApi.ts",
  exportName: "generatedApi",

  hooks: true,
};