const fs = require("fs");
const path = require("path");
const templates = require("../views/templates");

const projectRoot = path.resolve(__dirname, "..");
const user = {
  _id: "verification-user",
  email: "verify@example.com",
  gender: "Other",
  name: "Verification User",
  role: "admin",
  username: "verify.user",
};
const data = {
  role: "admin",
  roles: ["admin", "stsManager", "landfillManager", "unassigned"],
  user,
  users: [user],
};

for (const [name, renderTemplate] of Object.entries(templates)) {
  const html = renderTemplate(data);

  if (!html.includes("<!DOCTYPE html>")) {
    throw new Error(`Template ${name} did not render a complete HTML document.`);
  }
}

const appSource = fs.readFileSync(path.join(projectRoot, "app.js"), "utf8");
const wranglerSource = fs.readFileSync(
  path.join(projectRoot, "wrangler.toml"),
  "utf8"
);

if (/mongodb\+srv:\/\//i.test(appSource)) {
  throw new Error("A MongoDB connection string is hardcoded in app.js.");
}

if (/^\s*(MONGODB_URI|SESSION_SECRET)\s*=/m.test(wranglerSource)) {
  throw new Error("A required secret is stored as a Wrangler variable.");
}

if (!fs.existsSync(path.join(projectRoot, "public", "styles.css"))) {
  throw new Error("The shared stylesheet is missing from public/.");
}

console.log(
  `Rendered ${Object.keys(templates).length} precompiled templates and passed configuration safety checks.`
);
