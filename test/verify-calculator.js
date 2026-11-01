// Shift Worker Printables Kit — calculator verification
// Runs in Node. Tests the pure calculatePay() function from js/pay-calculator.js.
// Asdale Dynamics, LLC — client-side only, nothing stored or sent.

const fs = require("fs");
const path = require("path");

const errors = [];
function check(cond, msg) {
  if (!cond) errors.push("FAIL: " + msg);
  else console.log("ok: " + msg);
}

// Load calculatePay by stripping the DOM glue from the source file.
const jsPath = path.join(__dirname, "..", "js", "pay-calculator.js");
const js = fs.readFileSync(jsPath, "utf8");
const glueIdx = js.indexOf("// ---- DOM glue");
const pure = glueIdx > 0 ? js.slice(0, glueIdx) : js;

// Evaluate pure source and capture its exported functions.
const mod = { exports: {} };
new Function("module", "exports", "require", pure + "\nmodule.exports = { calculatePay, round2 };")(
  mod,
  mod.exports,
  require,
);
const { calculatePay, round2 } = mod.exports;

// Test 1: Worked example — $30/hr, 12 hrs, 10% differential, OT after 8 at 1.5x, 20% tax, 3 shifts/wk
const r1 = calculatePay({
  rate: 30,
  hours: 12,
  diffPct: 10,
  otThreshold: 8,
  otMultiplier: 1.5,
  taxPct: 20,
  shiftsPerWeek: 3,
});
check(r1.regularHours === 8, "regularHours = 8 (got " + r1.regularHours + ")");
check(r1.otHours === 4, "otHours = 4 (got " + r1.otHours + ")");
check(r1.basePay === 240, "basePay = 240 (got " + r1.basePay + ")");
check(r1.otPay === 180, "otPay = 180 (got " + r1.otPay + ")");
check(r1.differential === 36, "differential = 36 (got " + r1.differential + ")");
check(r1.gross === 456, "gross = 456 (got " + r1.gross + ")");
check(r1.tax === 91.2, "tax = 91.2 (got " + r1.tax + ")");
check(r1.net === 364.8, "net = 364.8 (got " + r1.net + ")");
check(r1.weeklyGross === 1368, "weeklyGross = 1368 (got " + r1.weeklyGross + ")");
check(r1.weeklyNet === 1094.4, "weeklyNet = 1094.4 (got " + r1.weeklyNet + ")");
check(r1.monthlyGross === 5923.44, "monthlyGross = 5923.44 (got " + r1.monthlyGross + ")");

// Test 2: Zero rate — should not crash, all zeros
const r2 = calculatePay({ rate: 0, hours: 5 });
check(r2.gross === 0, "zero rate -> gross 0");
check(r2.net === 0, "zero rate -> net 0");

// Test 3: No overtime threshold — all hours regular
const r3 = calculatePay({ rate: 20, hours: 10, otThreshold: 0 });
check(r3.regularHours === 10, "no threshold -> 10 regular hours");
check(r3.otHours === 0, "no threshold -> 0 OT hours");
check(r3.gross === 200, "no threshold -> gross 200");

// Test 4: Defaults (empty object)
const r4 = calculatePay({});
check(r4.gross === 0, "defaults -> gross 0");

// Test 5: round2 helper
check(typeof round2(1.005) === "number", "round2 returns a number");

console.log("\n" + (errors.length === 0 ? "ALL TESTS PASSED" : errors.length + " TEST(S) FAILED"));
if (errors.length) {
  errors.forEach((e) => console.log(e));
}
process.exit(errors.length === 0 ? 0 : 1);
