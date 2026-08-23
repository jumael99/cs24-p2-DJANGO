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
const PDFDocument = require("pdfkit");
const ejs = require("ejs");
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

// Middleware to ensure DB connection per request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    next();
  }
});

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

// EJS Template Engine with in-memory bundled templates support
app.engine("ejs", (filePath, options, callback) => {
  try {
    const normalized = filePath.replace(/\\/g, "/");
    const match = normalized.match(/([^\/]+)\.ejs$/);
    const viewName = match ? match[1] : filePath;

    if (templates[viewName]) {
      const html = templates[viewName](options);
      return callback(null, html);
    }

    const fs = require("fs");
    const content = fs.readFileSync(filePath, "utf8");
    const html = ejs.render(content, options);
    return callback(null, html);
  } catch (err) {
    return callback(err);
  }
});

app.set("view engine", "ejs");

// Express resolves view files on disk before invoking a template engine.
// Render bundled templates directly so res.render() also works in Workers,
// where the views directory is not available as a normal filesystem path.
const renderFromFileSystem = app.render.bind(app);
app.render = (viewName, options, callback) => {
  const normalizedName = viewName
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/\.ejs$/, "");

  if (!templates[normalizedName]) {
    return renderFromFileSystem(viewName, options, callback);
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
  res.render("login");
});

app.get("/login", (req, res) => {
  res.render("login");
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

    req.session.user = { id: user._id.toString(), username: user.username, role: user.role };

    // Redirect based on role
    switch (user.role) {
      case "admin":
        res.redirect("/admin-panel");
        break;
      case "stsManager":
        res.redirect("/sts-manager-panel");
        break;
      case "unassigned":
        res.send("User role Unassigned!! Can't login");
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
    res.render("admin-panel");
  } else {
    res.status(403).send("Access Denied");
  }
});

// STS-Manager Route
app.get("/sts-manager-panel", (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "stsManager") {
    res.render("sts-manager-panel");
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
    res.render("landfill-manager-panel");
  } else {
    res.redirect("/login");
  }
});

// Logout route
app.get("/auth/logout", (req, res) => {
  if (req.session && typeof req.session.destroy === "function") {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  } else {
    req.session = null;
    res.redirect("/login");
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
  if (req.session && req.session.user && req.session.user.id) {
    try {
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.render("profile-view", {
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
    res.render("landfill-data-entry");
  } else {
    res.redirect("/");
  }
});

// STS Data Creation
app.post("/sts-data/create", async (req, res) => {
  const { stsNumber, wasteWeight, startTime, landfillSelection, distanceKm } =
    req.body;

  let startDateTime = new Date();
  if (startTime) {
    let [hours, minutes] = startTime.split(":").map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);
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
  const stsNumber = req.body.stsNumber;

  try {
    const record = await STSData.findOne({ stsNumber: stsNumber });

    if (!record) {
      return res.status(404).send("STS Data not found");
    }

    const landfillSelection = record.landfillSelection;
    const distanceKm = record.distanceKm;
    const { rounds, cost, trucks } = calculateTruckRounds(record.wasteWeight);
    const distanceCost = cost * distanceKm;

    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      let pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Length": Buffer.byteLength(pdfData),
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment;filename="truck_rounds_report.pdf"',
        })
        .end(pdfData);
    });

    doc
      .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
      .stroke("#434343")
      .fillColor("#434343")
      .fontSize(24)
      .text(`Truck Rounds Report - STS ${stsNumber}`, { align: "center" })
      .moveDown()
      .fillColor("black");

    doc
      .fontSize(14)
      .text(`Landfill Selection: ${landfillSelection}`, { indent: 30 })
      .moveDown()
      .text(`Distance to Landfill: ${distanceKm} km`, { indent: 30 })
      .moveDown()
      .text(`Total Waste Weight: ${record.wasteWeight} tons`, { indent: 30 })
      .moveDown()
      .text(`Minimum Rounds Needed: ${rounds}`, { indent: 30 })
      .moveDown()
      .text(`Total Cost per KM: $${cost}`, { indent: 30 })
      .moveDown()
      .text(`Cost for ${distanceKm} km Distance: $${distanceCost.toFixed(2)}`, {
        indent: 30,
      })
      .moveDown();

    doc
      .fontSize(12)
      .text(
        "We've fixed that every STS has 4 different Trucks. In a trip if there is enough wastage all trucks will go. In the last trip if there is enough wastages and if waste is less than 3 tons open truck will go only if it is less than 5 tons dump truck will go if less that 15 tons container career will go otherwise Campactor truck will go. That's how we optimized the fleet. And then calculate oil for the total distance(km).",
        { indent: 30, align: "justify" }
      )
      .moveDown();

    const tableTop = doc.y + 20;
    doc.lineWidth(1).strokeColor("#434343");
    doc.rect(50, tableTop, doc.page.width - 100, 40).stroke();
    doc
      .fillColor("#434343")
      .fontSize(12)
      .text("Truck Type", 60, tableTop + 10)
      .text("Number of Trips", doc.page.width / 2, tableTop + 10);

    let tableBottom = tableTop + 40;
    trucks.forEach((truck) => {
      if (truck.trips > 0) {
        doc
          .fillColor("black")
          .text(truck.type, 60, tableBottom + 10)
          .text(truck.trips.toString(), doc.page.width / 2, tableBottom + 10);
        tableBottom += 30;
      }
    });

    doc.end();

    STSData.deleteOne({ stsNumber: stsNumber })
      .then(() =>
        console.log(`Record with STS number ${stsNumber} deleted successfully.`)
      )
      .catch((error) => console.error("Error deleting record:", error));
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
