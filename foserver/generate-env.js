const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "src/environment");
const targetPath = path.join(targetDir, "environment.ts");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env["apiUrl"]}',
  encryptionKey: '${process.env["encryptionKey"]}',
  encryptionIv: '${process.env["encryptionIv"]}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
