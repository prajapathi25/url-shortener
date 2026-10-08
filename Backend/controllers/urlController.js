// controllers/urlController.js

import validUrl from 'valid-url';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

/**
 * @desc    Create a shortened URL
 * @route   POST /api/shorten
 * @access  Private
 */
export const shortenUrl = async (req, res, next) => {
  const { longUrl } = req.body;

  // Check authentication
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'You must be logged in to shorten a URL',
    });
  }

  // Basic validation
  if (!longUrl) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a URL',
    });
  }

  // Validate URL
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format provided',
    });
  }

  try {
    // Check if this URL already exists for this user
    let url = await Url.findOne({
      longUrl,
      user: req.user.id,
    });

    if (url) {
      return res.status(200).json({
        success: true,
        data: url,
      });
    }

    // Generate unique short code
    const urlCode = nanoid(7);

    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

    // Create URL document
    const newUrlData = {
      longUrl,
      shortUrl,
      urlCode,
      user: req.user.id,
    };

    // Save URL
    url = await Url.create(newUrlData);

    return res.status(201).json({
      success: true,
      data: url,
    });

  } catch (error) {
    console.error('Database error:', error);
    next(error);
  }
};


/**
 * @desc    Find a URL by short code and redirect
 * @route   GET /:code
 * @access  Public
 */
export const redirectToUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      urlCode: req.params.code,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'No URL found',
      });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Redirect to original URL
    return res.redirect(301, url.longUrl);

  } catch (error) {
    console.error('Server error on redirect:', error);
    next(error);
  }
};