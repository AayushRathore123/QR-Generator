// generate-env.js
const fs = require("fs");

const targetPath = "./src/environment/environment.ts";

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env["apiUrl"]}',
  encryptionKey: '${process.env["encryptionKey"]}',
  encryptionIv: '${process.env["encryptionIv"]}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
