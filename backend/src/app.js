import express from 'express';
import urlRouter from './routes/url.route.js';
import { getFullURL } from './controllers/url.controller.js';

const app = express();

app.use(express.json());

// GET - Server starts
app.get('/', (_req, res) => {
  res.send('Server is successfully started.')
})

// POST - /api/url/create
app.use('/api/url', urlRouter);

// GET - /:shortId
app.get('/:shortId', getFullURL); // route parameter

export default app;