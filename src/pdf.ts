import puppeteer from 'puppeteer';


export async function renderPdfFromHtml(html: string): Promise<Buffer> {
// Puppeteer launch arguments tuned for headless servers like Render
const launchOptions = {
headless: true,
args: [
'--no-sandbox',
'--disable-setuid-sandbox',
'--disable-dev-shm-usage',
'--disable-accelerated-2d-canvas',
'--no-zygote',
'--single-process',
'--disable-gpu'
]
};


const browser = await puppeteer.launch(launchOptions);
try {
const page = await browser.newPage();
// Optional: set viewport, userAgent etc.
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });


const pdfBuffer = await page.pdf({
format: 'A4',
printBackground: true,
margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
}) as Buffer;


await page.close();
return pdfBuffer;
} finally {
await browser.close();
}
}