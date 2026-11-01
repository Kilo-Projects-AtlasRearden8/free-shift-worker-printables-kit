# STATUS

## What was built

A free printables kit for shift workers — Markdown sources plus a static HTML site, PDF-ready, low-energy design. Credit: Asdale Dynamics, LLC.

Files:
- `index.html` — landing page linking to all four printables with print instructions
- `printables/shift-log.html` — monthly shift log (date, day, shift type, start/end, breaks, hours, overnight flag, monthly totals)
- `printables/sleep-tracker.html` — sleep tracker (bedtime, wake time, hours slept, quality 1–5, naps, notes, low-energy sleep tips)
- `printables/swap-sheet.html` — shift swap request/approval form with signature lines and swap log
- `printables/pay-calculator.html` — client-side pay calculator (gross, overtime, differential, tax, weekly/monthly estimates)
- `css/style.css` — shared styles with `@media print` and A4 page rules (hides nav, strips backgrounds for print)
- `css/site.css` — landing page styles
- `js/pay-calculator.js` — pure `calculatePay()` function plus DOM glue; runs entirely in the browser
- `src/markdown/*.md` — Markdown sources mirroring each printable's content
- `README.md` — kit contents, how to use, design notes, Asdale Dynamics, LLC credit, MIT license pointer
- `LICENSE` — MIT License, copyright line exactly: `Copyright (c) 2026 Asdale Dynamics, LLC`

## How to run it

Open any HTML file directly in a browser (no build step, no server):

- `index.html` — kit landing page
- `printables/<name>.html` — individual printables

To produce a PDF: open a printable, choose File > Print, then Save as PDF / Microsoft Print to PDF. Each page is sized for US Letter or A4 at 100%.

Markdown sources live in `src/markdown/` for editing or republishing.

## Verification results

Ran with Node.js v20.19.2 (no headless browser or PDF tooling available in this environment).

- All 13 expected files present.
- `LICENSE` contains the exact copyright line `Copyright (c) 2026 Asdale Dynamics, LLC`.
- `README.md` and all HTML pages credit Asdale Dynamics, LLC.
- Every HTML page has `<title>`, `<h1>`, no leftover template placeholders.
- `css/style.css` contains `@media print` and `@page { size: A4 }`.
- Pay calculator logic unit-tested in Node by evaluating `calculatePay()` directly:
  - $30/hr, 12 hrs, 10% differential, OT after 8 hrs at 1.5×, 20% tax, 3 shifts/wk → gross $456.00, tax $91.20, net $364.80, weekly gross $1,368.00, monthly gross $5,923.44 — matches hand calculation.
  - Zero-rate and no-threshold edge cases return sane values.
- No secrets, API keys, or personal data found in any file.
- No `.github/workflows` files present.

Limitation: actual PDF rendering was not executed locally because no PDF toolchain (pandoc, wkhtmltopdf, headless Chromium) is installed; print stylesheet was reviewed by inspection instead.

## Known gaps

- PDF output not generated or pixel-verified in this session; verify print/PDF output in a real browser before distributing.
- Printables are blank templates; no pre-filled example data is printed on the forms.
- Accessibility audit not run (color contrast chosen conservatively, but not tool-verified).
- No test framework or CI configured (intentionally: no `.github/workflows`).
