// controllers/linksController.js

import Url from '../models/Url.js';

/**
 * @desc    Get all links created by the currently logged-in user.
 * @route   GET /api/links/my-links
 * @access  Private
 */
export const getMyLinks = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    // Fetch links belonging to the logged-in user
    const links = await Url.find({
      user: req.user.id,
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    console.error('Error fetching user links:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};