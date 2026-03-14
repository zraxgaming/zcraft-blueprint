import express from 'express';
import { render } from './dist/entry-server.js';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('dist'));

// Handle all routes with SSR
app.get('*', async (req, res) => {
  try {
    const html = await render(req.url);
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    console.error('SSR Error:', e);
    res.status(500).end('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});