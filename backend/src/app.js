import express from "express";
import urlRouter from "./routes/url.route.js";
import { getFullURL } from "./controllers/url.controller.js";
import { notFoundHandler, globalErrorHandler } from "./utils/errors/error.middleware.js";

const app = express();

app.use(express.json());

// GET - Server starts
app.get("/", (_req, res) => {
  res.send("Server is successfully started.");
});

// POST - /api/url/create
app.use("/api/url", urlRouter);

// GET - /:shortId
app.get("/:shortId", getFullURL); // route parameter

// Route mismatch handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

export default app;
