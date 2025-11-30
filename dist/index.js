"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pdf_1 = require("./pdf");
const app = (0, express_1.default)();
app.use(body_parser_1.default.text({ type: ['text/*', 'application/xhtml+xml', 'application/xml', 'text/html'], limit: '10mb' }));
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.get('/', (_req, res) => res.send('PDF API is alive'));
// POST HTML (raw HTML string) -> returns PDF buffer
app.post('/api/pdf', async (req, res) => {
    try {
        const html = typeof req.body === 'string' ? req.body : req.body?.html;
        if (!html)
            return res.status(400).json({ error: 'No HTML provided. Send raw HTML body or {"html":"..."} JSON.' });
        const pdfBuffer = await (0, pdf_1.renderPdfFromHtml)(html);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename="document.pdf"'
        });
        return res.send(pdfBuffer);
    }
    catch (err) {
        console.error('PDF generation failed:', err);
        return res.status(500).json({ error: err.message || 'PDF generation error' });
    }
});
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
