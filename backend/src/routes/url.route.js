import { Router } from 'express';
import { createShortURL } from '../controllers/url.controller.js';

const urlRouter = Router();

/**
 * POST - /api/url/create
 */
urlRouter.post("/create", createShortURL);

export default urlRouter;