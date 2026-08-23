const fs = require("fs");
const path = require("path");
const templates = require("../views/templates");
const { buildTransportReportPdf } = require("../utils/reportPdf");

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
  isDemo: false,
  role: "admin",
  roles: ["admin", "stsManager", "landfillManager"],
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

const reportPdf = buildTransportReportPdf({
  costPerKm: 30,
  destination: "Matuail",
  distanceKm: 18,
  reportDate: "2026-08-23",
  rounds: 1,
  stsNumber: 101,
  totalCost: 540,
  trucks: [{ type: "Compactor Truck", trips: 1 }],
  wasteWeight: 58,
});
const reportSource = reportPdf.toString("binary");

if (!reportSource.startsWith("%PDF-1.4") || !reportSource.includes("/MediaBox [0 0 595 842]")) {
  throw new Error("The transport report generator did not create a valid A4 PDF.");
}

if (!reportSource.includes("(STS 101)") || !reportSource.endsWith("%%EOF\n")) {
  throw new Error("The transport report PDF is incomplete.");
}

console.log(
  `Rendered ${Object.keys(templates).length} precompiled templates, generated an A4 PDF, and passed configuration safety checks.`
);
