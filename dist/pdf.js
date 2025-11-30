"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPdfFromHtml = renderPdfFromHtml;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function renderPdfFromHtml(html) {
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
    const browser = await puppeteer_1.default.launch(launchOptions);
    try {
        const page = await browser.newPage();
        // Optional: set viewport, userAgent etc.
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
        });
        await page.close();
        return pdfBuffer;
    }
    finally {
        await browser.close();
    }
}
