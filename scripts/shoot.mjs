// Dev helper: screenshots the site at a list of scroll positions (in viewport heights).
// usage: node scripts/shoot.mjs <outDir> <width> <height> <vh,vh,...>
import puppeteer from "puppeteer-core";
const [out, W = "1440", H = "900", list = "0"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: +W, height: +H, deviceScaleFactor: 1 });
const logs = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && logs.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => logs.push("pageerror: " + e.message));
await page.goto("http://localhost:5179/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 5200));
const total = await page.evaluate(() => document.documentElement.scrollHeight / innerHeight);
console.log("page height (vh):", total.toFixed(1));
console.log(await page.evaluate(() => [...document.querySelectorAll("main > *, main > * > section, footer")].map((e) => {
  const el = e.classList.contains("pin-spacer") ? e.firstElementChild : e;
  return `${(el.id || el.getAttribute("aria-label") || el.className.toString().slice(0, 24))}@${((e.getBoundingClientRect().top + scrollY) / innerHeight).toFixed(2)}`;
}).join("  ")));
for (const v of list.split(",")) {
  await page.evaluate((y) => window.scrollTo(0, y * innerHeight), +v);
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: `${out}/s-${W}-${v}.jpg`, type: "jpeg", quality: 70 });
}
console.log(logs.join("\n") || "no console errors");
await browser.close();
