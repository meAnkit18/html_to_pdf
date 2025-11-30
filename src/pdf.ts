import puppeteer from "puppeteer";

export async function renderPdfFromHtml(html: string) {
  const browser = await puppeteer.launch({
    headless: true, // ← FIXED
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--disable-software-rasterizer"
    ]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();
  return pdf;
}
