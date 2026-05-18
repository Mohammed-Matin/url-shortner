import express from 'express';

const app = express();

// GET - Server starts
app.get('/', (_req, res) => {
  res.send('Server is successfully started.')
})

export default app;