// routes/links.js

import express from 'express';
import auth from '../middleware/auth.js';
import { getMyLinks } from '../controllers/linksController.js';

const router = express.Router();

/**
 * @route   GET /api/links/my-links
 * @desc    Get all links created by the logged-in user
 * @access  Private
 */
router.get('/my-links', auth, getMyLinks);

export default router;