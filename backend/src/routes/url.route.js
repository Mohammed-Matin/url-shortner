import { Router } from "express";
import { createShortURL } from "../controllers/url.controller.js";
import { notFoundHandler } from "../utils/errors/error.middleware.js";

const urlRouter = Router();

/**
 * POST - /api/url/create
 */
urlRouter.post("/create", createShortURL);

// Handle any /api/url/* mismatch at router level and forward to centralized 404 logic.
urlRouter.use(notFoundHandler);

export default urlRouter;
