const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

require("dotenv").config();

const requiredSecrets = ["MONGODB_URI", "SESSION_SECRET"];
const forwardedArguments = process.argv.slice(2);
const availableSecrets = Object.fromEntries(
  requiredSecrets
    .filter((name) => Boolean(process.env[name]))
    .map((name) => [name, process.env[name]])
);
const missingSecrets = requiredSecrets.filter((name) => !availableSecrets[name]);
const wranglerPath = path.join(
  path.dirname(require.resolve("wrangler/package.json")),
  "bin",
  "wrangler.js"
);

function runWrangler(argumentsList) {
  const result = spawnSync(process.execPath, [wranglerPath, ...argumentsList], {
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
}

if (missingSecrets.length === requiredSecrets.length) {
  console.log(
    "No deploy-time secret values found. Deploying with secrets already stored on the Worker."
  );
  runWrangler(["deploy", ...forwardedArguments]);
} else if (missingSecrets.length > 0) {
  console.error(
    `Deployment stopped: the following build secret is missing: ${missingSecrets.join(
      ", "
    )}. Add both required secrets before retrying.`
  );
  process.exitCode = 1;
} else {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ecosync-deploy-")
  );
  const secretsPath = path.join(temporaryDirectory, "secrets.json");

  try {
    fs.writeFileSync(secretsPath, JSON.stringify(availableSecrets), {
      encoding: "utf8",
      mode: 0o600,
    });
    console.log(
      "Deploy-time secrets found. Uploading them as encrypted Worker runtime secrets."
    );
    runWrangler([
      "deploy",
      "--secrets-file",
      secretsPath,
      ...forwardedArguments,
    ]);
  } finally {
    fs.rmSync(temporaryDirectory, { force: true, recursive: true });
  }
}
