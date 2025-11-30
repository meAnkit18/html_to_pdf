import express from 'express';
import bodyParser from 'body-parser';
import { renderPdfFromHtml } from './pdf';


const app = express();
app.use(bodyParser.text({ type: ['text/*', 'application/xhtml+xml', 'application/xml', 'text/html'] , limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));


app.get('/', (_req, res) => res.send('PDF API is alive'));


// POST HTML (raw HTML string) -> returns PDF buffer
app.post('/api/pdf', async (req, res) => {
try {
const html = typeof req.body === 'string' ? req.body : req.body?.html;
if (!html) return res.status(400).json({ error: 'No HTML provided. Send raw HTML body or {"html":"..."} JSON.' });


const pdfBuffer = await renderPdfFromHtml(html);


res.set({
'Content-Type': 'application/pdf',
'Content-Length': pdfBuffer.length,
'Content-Disposition': 'attachment; filename="document.pdf"'
});


return res.send(pdfBuffer);
} catch (err: any) {
console.error('PDF generation failed:', err);
return res.status(500).json({ error: err.message || 'PDF generation error' });
}
});


const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));