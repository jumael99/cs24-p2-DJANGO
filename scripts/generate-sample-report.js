const fs = require("fs");
const path = require("path");
const { buildTransportReportPdf } = require("../utils/reportPdf");
const { calculateTruckRounds } = require("../truckCalculations");

const outputDirectory = path.resolve(__dirname, "..", "tmp", "pdfs");
const outputPath = path.join(outputDirectory, "ecosync-sts-101-report.pdf");
const { rounds, cost, trucks } = calculateTruckRounds(58);

const pdf = buildTransportReportPdf({
  costPerKm: cost,
  destination: "Matuail",
  distanceKm: 18,
  reportDate: new Date().toISOString().slice(0, 10),
  rounds,
  stsNumber: 101,
  totalCost: Number(cost) * 18,
  trucks,
  wasteWeight: 58,
});

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, pdf);
console.log(outputPath);
