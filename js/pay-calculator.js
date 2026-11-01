/*
 * Shift Worker Printables Kit — pay calculator logic
 * Pure calculation function plus DOM glue.
 * Asdale Dynamics, LLC — client-side only, nothing is stored or sent.
 */

/**
 * Calculate shift pay and projections.
 *
 * @param {number} rate        Hourly base rate
 * @param {number} hours       Hours worked on the shift
 * @param {number} diffPct     Shift differential percent (e.g. 10 for 10%)
 * @param {number} otThreshold Hours after which overtime applies
 * @param {number} otMultiplier Overtime multiplier (e.g. 1.5)
 * @param {number} taxPct      Estimated tax withholding percent
 * @param {number} shiftsPerWeek Typical shifts per week
 * @returns {object}
 */
function calculatePay({ rate = 0, hours = 0, diffPct = 0, otThreshold = 0, otMultiplier = 1.5, taxPct = 0, shiftsPerWeek = 0 } = {}) {
  const r = Number(rate) || 0;
  const h = Number(hours) || 0;
  const d = Number(diffPct) || 0;
  const t = Number(otThreshold) || 0;
  const m = Number(otMultiplier) || 1.5;
  const x = Number(taxPct) || 0;
  const w = Number(shiftsPerWeek) || 0;

  const regularHours = t > 0 ? Math.min(h, t) : h;
  const otHours = t > 0 ? Math.max(0, h - t) : 0;

  const basePay = regularHours * r;
  const otPay = otHours * r * m;
  const differential = h * r * (d / 100);

  const gross = basePay + otPay + differential;
  const tax = gross * (x / 100);
  const net = gross - tax;

  const weeklyGross = gross * w;
  const weeklyNet = net * w;
  const monthlyGross = weeklyGross * 4.33;
  const monthlyNet = weeklyNet * 4.33;

  return {
    regularHours,
    otHours,
    basePay: round2(basePay),
    otPay: round2(otPay),
    differential: round2(differential),
    gross: round2(gross),
    tax: round2(tax),
    net: round2(net),
    weeklyGross: round2(weeklyGross),
    weeklyNet: round2(weeklyNet),
    monthlyGross: round2(monthlyGross),
    monthlyNet: round2(monthlyNet),
  };
}

function round2(v) { return Math.round((v + Number.EPSILON) * 100) / 100; }

function fmt(v) { return v.toFixed(2); }

// ---- DOM glue (runs in browser only) ----
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pay-form");
    if (!form) return;

    const inputs = {
      rate: form.elements["rate"],
      hours: form.elements["hours"],
      diff: form.elements["diff"],
      otThreshold: form.elements["ot-threshold"],
      otMultiplier: form.elements["ot-multiplier"],
      tax: form.elements["tax"],
      shifts: form.elements["shifts"],
    };

    const outputs = {
      regular: document.getElementById("out-regular-hours"),
      ot: document.getElementById("out-ot-hours"),
      base: document.getElementById("out-base-pay"),
      otPay: document.getElementById("out-ot-pay"),
      differential: document.getElementById("out-differential"),
      gross: document.getElementById("out-gross"),
      tax: document.getElementById("out-tax"),
      net: document.getElementById("out-net"),
      weeklyGross: document.getElementById("out-weekly-gross"),
      weeklyNet: document.getElementById("out-weekly-net"),
      monthlyGross: document.getElementById("out-monthly-gross"),
      monthlyNet: document.getElementById("out-monthly-net"),
    };

    function update() {
      const result = calculatePay({
        rate: inputs.rate.value,
        hours: inputs.hours.value,
        diffPct: inputs.diff.value,
        otThreshold: inputs.otThreshold.value,
        otMultiplier: inputs.otMultiplier.value,
        taxPct: inputs.tax.value,
        shiftsPerWeek: inputs.shifts.value,
      });

      outputs.regular.textContent = result.regularHours;
      outputs.ot.textContent = result.otHours;
      outputs.base.textContent = fmt(result.basePay);
      outputs.otPay.textContent = fmt(result.otPay);
      outputs.differential.textContent = fmt(result.differential);
      outputs.gross.textContent = fmt(result.gross);
      outputs.tax.textContent = fmt(result.tax);
      outputs.net.textContent = fmt(result.net);
      outputs.weeklyGross.textContent = fmt(result.weeklyGross);
      outputs.weeklyNet.textContent = fmt(result.weeklyNet);
      outputs.monthlyGross.textContent = fmt(result.monthlyGross);
      outputs.monthlyNet.textContent = fmt(result.monthlyNet);
    }

    Object.values(inputs).forEach((el) => el.addEventListener("input", update));
    update();
  });
}
