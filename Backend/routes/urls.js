// routes/urls.js

import express from 'express';
import { shortenUrl } from '../controllers/urlController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/shorten
 * @desc    Create a new short URL
 * @access  Public
 */
router.post('/', auth, shortenUrl);

export default router;