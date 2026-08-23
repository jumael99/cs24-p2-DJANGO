require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const mongoose = require("mongoose/index.js");
const cookieSession = require("cookie-session");
const { isAdmin } = require("./utils/roleMiddleware");
const User = require("./models/user.model");
const STSData = require("./models/stsData.model");
const { calculateTruckRounds } = require("./truckCalculations");
const { buildTransportReportPdf } = require("./utils/reportPdf");
const templates = require("./views/templates");

const app = express();
const PORT = process.env.PORT || 5000;

function getRequiredEnvironmentVariable(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const mongoDBUri = getRequiredEnvironmentVariable("MONGODB_URI");
const sessionSecret = getRequiredEnvironmentVariable("SESSION_SECRET");

// Serverless MongoDB Connection Cache
let dbPromise = null;
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!dbPromise) {
    dbPromise = mongoose
      .connect(mongoDBUri, {
        serverSelectionTimeoutMS: 5000,
      })
      .catch((err) => {
        dbPromise = null;
        throw err;
      });
  }
  await dbPromise;
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Cookie-based Session for Cloudflare Workers edge compatibility
app.use(
  cookieSession({
    name: "ecosync_session",
    keys: [sessionSecret],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })
);

// Public pages and read-only demo sessions do not need a database connection.
// All real authenticated and data operations still connect through MongoDB.
app.use(async (req, res, next) => {
  const isPublicPath =
    req.path === "/" ||
    req.path === "/login" ||
    req.path === "/auth/logout" ||
    req.path.startsWith("/demo/");
  const isDemoSession = Boolean(req.session && req.session.user && req.session.user.demo);

  if (isPublicPath || isDemoSession) {
    return next();
  }

  try {
    await connectDB();
    return next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    return next();
  }
});

app.set("view engine", "ejs");

// Render precompiled templates directly. Cloudflare Workers does not expose
// the views directory as a normal filesystem and disallows runtime compilation.
app.render = (viewName, options, callback) => {
  const normalizedName = viewName
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/\.ejs$/, "");

  if (!templates[normalizedName]) {
    return callback(new Error(`Unknown view: ${normalizedName}`));
  }

  try {
    const html = templates[normalizedName](options);
    return callback(null, html);
  } catch (error) {
    return callback(error);
  }
};

// Use routes
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/login", (req, res) => {
  res.render("login");
});

const demoRoles = {
  admin: {
    destination: "/admin-panel",
    name: "Demo Administrator",
    username: "demo.admin",
  },
  stsManager: {
    destination: "/sts-manager-panel",
    name: "Demo STS Manager",
    username: "demo.sts",
  },
  landfillManager: {
    destination: "/landfill-manager-panel",
    name: "Demo Landfill Manager",
    username: "demo.landfill",
  },
};

// Client-safe workspace previews. Demo sessions never write to live data.
app.post("/demo/:role", (req, res) => {
  const selectedRole = demoRoles[req.params.role];

  if (!selectedRole) {
    return res.status(404).send("Workspace not found");
  }

  req.session.user = {
    demo: true,
    name: selectedRole.name,
    role: req.params.role,
    username: selectedRole.username,
  };

  return res.redirect(selectedRole.destination);
});

// Auth login route
app.post("/auth/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    let user =
      (await User.findOne({ username: login })) ||
      (await User.findOne({ email: login }));

    if (!user) {
      return res.status(401).send("Username or email does not exist.");
    }

    if (user.password !== password) {
      return res.status(401).send("Incorrect password");
    }

    req.session.user = { demo: false, id: user._id.toString(), username: user.username, role: user.role };

    // Redirect based on role
    switch (user.role) {
      case "admin":
        res.redirect("/admin-panel");
        break;
      case "stsManager":
        res.redirect("/sts-manager-panel");
        break;
      case "landfillManager":
        res.redirect("/landfill-manager-panel");
        break;
      default:
        res.send("Access Denied");
        break;
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Server error during authentication.");
  }
});

// Admin Route
app.get("/admin-panel", (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    res.render("admin-panel", { isDemo: Boolean(req.session.user.demo) });
  } else {
    res.status(403).send("Access Denied");
  }
});

// STS-Manager Route
app.get("/sts-manager-panel", (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "stsManager") {
    res.render("sts-manager-panel", { isDemo: Boolean(req.session.user.demo) });
  } else {
    res.redirect("/login");
  }
});

// Landfill Manager Panel Route
app.get("/landfill-manager-panel", (req, res) => {
  if (
    req.session &&
    req.session.user &&
    (req.session.user.role === "landfillManager" || req.session.user.role === "admin")
  ) {
    res.render("landfill-manager-panel", { isDemo: Boolean(req.session.user.demo) });
  } else {
    res.redirect("/login");
  }
});

// Logout route
app.get("/auth/logout", (req, res) => {
  if (req.session && typeof req.session.destroy === "function") {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    req.session = null;
    res.redirect("/");
  }
});

// STS-Manager info edit
app.get("/sts-manager/edit", (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "stsManager") {
    res.render("edit-sts-manager");
  } else {
    res.redirect("/login");
  }
});

// STS Manager data entry
app.get("/sts-manager/data-entry", (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "stsManager") {
    res.render("data-entries");
  } else {
    res.redirect("/login");
  }
});

// Profile View
app.get("/profile", async (req, res) => {
  if (req.session && req.session.user && req.session.user.demo) {
    const demoUser = {
      email: `${req.session.user.username}@ecosync.demo`,
      gender: "Other",
      name: req.session.user.name,
      role: req.session.user.role,
      username: req.session.user.username,
    };

    return res.render("profile-view", {
      isDemo: true,
      role: demoUser.role,
      user: demoUser,
    });
  }

  if (req.session && req.session.user && req.session.user.id) {
    try {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.render("profile-view", {
        isDemo: false,
        user: user.toObject(),
        role: user.role,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Server error");
    }
  } else {
    res.redirect("/login");
  }
});

// Profile Update
app.post("/profile", async (req, res) => {
  const { name, email, username, gender, password } = req.body;

  if (!req.session || !req.session.user) {
    return res.status(403).send("Not logged in");
  }

  if (req.session.user.demo) {
    return res.redirect("/profile");
  }

  try {
    const updateData = { name, email, username, gender };
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    await User.findByIdAndUpdate(req.session.user.id, updateData);
    req.session.user = { ...req.session.user, ...updateData };

    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("Error updating profile");
  }
});

// Landfill data-entry
app.get("/landfill-data-entry", (req, res) => {
  if (
    req.session &&
    req.session.user &&
    (req.session.user.role === "landfillManager" || req.session.user.role === "admin")
  ) {
    res.render("landfill-data-entry", { isDemo: Boolean(req.session.user.demo) });
  } else {
    res.redirect("/");
  }
});

// STS Data Creation
app.post("/sts-data/create", async (req, res) => {
  if (!req.session || !req.session.user || req.session.user.role !== "stsManager") {
    return res.status(403).send("STS Manager access is required.");
  }

  const { stsNumber, wasteWeight, startTime, landfillSelection, distanceKm } =
    req.body;

  let startDateTime = new Date();
  if (startTime) {
    let [hours, minutes] = startTime.split(":").map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);
  }

  if (req.session && req.session.user && req.session.user.demo) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="refresh" content="2;url=/sts-manager-panel" />
        <title>Entry previewed | EcoSync</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body><main class="status-page"><section class="status-card"><span class="badge">Demo preview</span><h1>Entry captured</h1><p>The complete submission flow works. No live data was changed during this preview.</p><a class="btn btn--primary" href="/sts-manager-panel">Return to workspace</a></section></main></body>
      </html>
    `);
  }

  try {
    await STSData.create({
      stsNumber: parseInt(stsNumber, 10),
      wasteWeight: parseFloat(wasteWeight),
      startTime: startDateTime,
      landfillSelection: landfillSelection,
      distanceKm: parseFloat(distanceKm),
    });

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Submission Success</title>
          <meta http-equiv="refresh" content="3;url=/sts-manager/data-entry" />
      </head>
      <body>
          <div class="text-center">
          <h1>Success!</h1>
          <p>Your data has been successfully submitted. You will be redirected shortly.</p>
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error saving STS data:", error);
    res.status(500).send("Error submitting data");
  }
});

// Print Report (PDF Generation)
app.post("/print-report", async (req, res) => {
  const permittedRoles = ["admin", "landfillManager"];
  if (
    !req.session ||
    !req.session.user ||
    !permittedRoles.includes(req.session.user.role)
  ) {
    return res.status(403).send("Landfill Manager access is required.");
  }

  const stsNumber = req.body.stsNumber;

  try {
    const isDemo = Boolean(req.session && req.session.user && req.session.user.demo);
    const record = isDemo
      ? {
          distanceKm: 18,
          landfillSelection: "Matuail",
          startTime: new Date("2026-08-23T08:30:00Z"),
          stsNumber: 101,
          wasteWeight: 58,
        }
      : await STSData.findOne({ stsNumber: stsNumber });

    if (!record) {
      return res.status(404).send("STS Data not found");
    }

    const landfillSelection = record.landfillSelection;
    const distanceKm = record.distanceKm;
    const { rounds, cost, trucks } = calculateTruckRounds(record.wasteWeight);
    const distanceCost = cost * distanceKm;

    const reportDate = new Date().toISOString().slice(0, 10);
    const pdfData = buildTransportReportPdf({
      costPerKm: cost,
      destination: landfillSelection,
      distanceKm,
      reportDate,
      rounds,
      stsNumber,
      totalCost: distanceCost,
      trucks,
      wasteWeight: record.wasteWeight,
    });

    return res
      .status(200)
      .set({
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="ecosync-sts-${stsNumber}-report.pdf"`,
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "X-Content-Type-Options": "nosniff",
      })
      .send(pdfData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

// Run server directly when executed via Node.js
if (require.main === module) {
  connectDB()
    .then(() => {
      console.log("MongoDB connection successful");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
}

module.exports = app;
