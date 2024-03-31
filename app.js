require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes"); // Adjust the path based on your structure
const mongoose = require("mongoose");
const session = require("express-session");
const { isAdmin } = require("./utils/roleMiddleware");
const User = require("./models/user.model");
const { calculateTruckRounds } = require("./truckCalculations");

// MongoDB connection string from your Atlas dashboard
const mongoDBUri =
  "mongodb+srv://ehtesamul99:55555@cluster0.ogknxls.mongodb.net/xy?retryWrites=true&w=majority&appName=Cluster0";
const STSData = require("./models/stsData.model"); // Adjust the path as necessary based on your project structure
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "your_secret_key", // Use a long, random string in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: "auto", maxAge: 3600000 }, // secure: 'auto' will use secure cookies if the site uses HTTPS
  })
);

app.set("view engine", "ejs");

// Hardcoded admin credentials
const adminCredentials = {
  username: "admin",
  password: "admin",
};

// Use routes
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/login", (req, res) => {
  res.render("login");
});

// Auth routes
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // First, check if the username exists in the database
  const user = await User.findOne({ username });

  if (!user) {
    // If the username isn't found, send a specific error message
    return res.status(401).send("Username does not exist");
  }

  // If the username exists but the password doesn't match, send a different error
  if (user.password !== password) {
    return res.status(401).send("Incorrect password");
  }

  // If both username and password match, proceed with setting the session and redirecting
  req.session.user = { id: user._id, username: user.username, role: user.role };

  // Redirect based on role
  switch (user.role) {
    case "admin":
      return res.redirect("/admin-panel");
    case "stsManager":
      return res.redirect("/sts-manager-panel");
    case "unassigned":
      return res.status(401).send("User role Unassigned!! Can't login");
    case "landfillManager":
      return res.redirect("/landfill-manager-panel");
    default:
      return res.status(403).send("Access Denied");
  }
});

//admin-route
app.get("/admin-panel", (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    res.render("admin-panel");
  } else {
    res.status(403).send("Access Denied");
  }
});

//sts-manager route
app.get("/sts-manager-panel", (req, res) => {
  if (req.session.user && req.session.user.role === "stsManager") {
    res.render("sts-manager-panel");
  } else {
    res.status(403).send("Access Denied");
  }
});

// Landfill Manager Panel Route
app.get("/landfill-manager-panel", (req, res) => {
  if (req.session.user && req.session.user.role === "landfillManager") {
    res.render("landfill-manager-panel");
  } else {
    res.status(403).send("Access Denied");
  }
});

// Logout route
app.get("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err); // Log any error if session destruction fails
      res.send("Error logging out"); // Send or handle the error in a way that makes sense for your application
    } else {
      res.redirect("/login"); // Redirect to login page after successful logout
    }
  });
});

//sts-manager info edit
app.get("/sts-manager/edit", (req, res) => {
  // Ensure the user is authenticated and has the stsManager role
  if (req.session.user && req.session.user.role === "stsManager") {
    res.render("edit-sts-manager");
  } else {
    res.status(403).send("Access Denied");
  }
});

//sts manager data entry
app.get("/sts-manager/data-entry", (req, res) => {
  // Ensure the user is authenticated and has the stsManager role
  if (req.session.user && req.session.user.role === "stsManager") {
    res.render("data-entries");
  } else {
    res.status(403).send("Access Denied");
  }
});

//This endpoint will serve the profile view with the user's current information.
app.get("/profile", async (req, res) => {
  if (req.session.user && req.session.user.id) {
    try {
      // Fetch the complete user data from the database
      const user = await User.findById(req.session.user.id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Render the profile with the complete user data
      res.render("profile-view", {
        user: user.toObject(), // Convert the MongoDB document to a plain JavaScript object
        role: user.role, // Assuming the role field is directly available on the user document
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Server error");
    }
  } else {
    // Redirect to login page or display an error message
    res.redirect("/login");
  }
});
//PUT /profile for Updating the Logged-in User's Profile
app.post("/profile", async (req, res) => {
  const { name, email, username, gender, password } = req.body;

  if (!req.session.user) {
    return res.status(403).send("Not logged in");
  }

  try {
    // Prepare update data excluding empty password
    const updateData = { name, email, username, gender };
    if (password && password.trim() !== "") {
      updateData.password = password; // Update password only if it's provided
    }

    // Update the user profile
    await User.findByIdAndUpdate(req.session.user.id, updateData);

    // Optionally, update session information
    req.session.user = { ...req.session.user, ...updateData };

    res.redirect("/profile"); // Redirect to the profile page after the update
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send("Error updating profile");
  }
});

//landfill data-entry
app.get("/landfill-data-entry", (req, res) => {
  res.render("landfill-data-entry");
});

//sts-data post from ejs form
// Example route handler for form submission
app.post("/sts-data/create", async (req, res) => {
  // create is ok now
  const { stsNumber, wasteWeight, startTime, landfillSelection, distanceKm } =
    req.body;

  // Create a new Date object for today
  let startDateTime = new Date();

  // Extract hours and minutes from the startTime string
  let [hours, minutes] = startTime.split(":").map(Number);

  // Set hours and minutes to the startDateTime object
  startDateTime.setHours(hours, minutes, 0, 0);

  try {
    await STSData.create({
      stsNumber: parseInt(stsNumber, 10),
      wasteWeight: parseFloat(wasteWeight),
      startTime: startDateTime,
      landfillSelection: landfillSelection, // Added landfillSelection
      distanceKm: parseFloat(distanceKm), // Added distanceKm and ensure it's a number
    });

    // Successful submission response
    res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Submission Success</title>
                <meta http-equiv="refresh" content="3;url=/sts-manager/data-entry" />
            </head>
            <body>
                <h1>Success!</h1>
                <p>Your data has been successfully submitted. You will be redirected shortly.</p>
            </body>
            </html>
        `);
  } catch (error) {
    console.error("Error saving STS data:", error);
    res.status(500).send("Error submitting data");
  }
});

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

    // Initialize PDF document
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

    // Add border and title
    doc
      .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
      .stroke("#434343")
      .fillColor("#434343")
      .fontSize(24)
      .text(`Truck Rounds Report - STS ${stsNumber}`, { align: "center" })
      .moveDown()
      .fillColor("black");

    // Add content with formatting
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
      .text(`Total Cost: $${cost}`, { indent: 30 })
      .moveDown()
      .text(`Cost for ${distanceKm} km Distance: $${distanceCost.toFixed(2)}`, {
        indent: 30,
      })
      .moveDown();

    // Add truck details in a table
    const tableTop = 500;
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
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

mongoose
  .connect(mongoDBUri)
  .then(() => {
    console.log("MongoDB connection successful");

    // Start the server after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
