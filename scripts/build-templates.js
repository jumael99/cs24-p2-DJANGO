const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const projectRoot = path.resolve(__dirname, "..");
const viewsDirectory = path.join(projectRoot, "views");
const outputPath = path.join(viewsDirectory, "templates.js");
const checkOnly = process.argv.includes("--check");

const templates = Object.fromEntries(
  fs
    .readdirSync(viewsDirectory)
    .filter((fileName) => fileName.endsWith(".ejs"))
    .sort()
    .map((fileName) => {
      const filePath = path.join(viewsDirectory, fileName);
      const source = fs.readFileSync(filePath, "utf8");

      const compiledTemplate = ejs.compile(source, {
        _with: false,
        client: true,
        compileDebug: false,
        destructuredLocals: ["isDemo", "role", "roles", "user", "users"],
        filename: filePath,
        strict: true,
      });

      const compiledSource = compiledTemplate
        .toString()
        .replace(/[ \t]+$/gm, "");

      return [path.basename(fileName, ".ejs"), compiledSource];
    })
);

const serializedTemplates = Object.entries(templates)
  .map(([name, compiledTemplate]) => {
    return `  ${JSON.stringify(name)}: ${compiledTemplate}`;
  })
  .join(",\n");

const output = [
  "// Pre-bundled EJS templates for serverless/edge environments (Cloudflare Workers)",
  "// Generated from the files in views/. Templates are compiled at build time because Workers disallow runtime code generation.",
  "",
  "const templates = {",
  serializedTemplates,
  "};",
  "",
  "module.exports = templates;",
  "",
].join("\n");

if (checkOnly) {
  const existingOutput = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, "utf8")
    : "";

  if (existingOutput !== output) {
    console.error("views/templates.js is out of date. Run `npm run build`.");
    process.exitCode = 1;
  } else {
    console.log("All EJS views compile and the Worker template bundle is current.");
  }
} else {
  fs.writeFileSync(outputPath, output);
  console.log(`Precompiled ${Object.keys(templates).length} EJS templates.`);
}
