const express = require('express');
const { verifyImage } = require('../services/gemini');
const { getCachedData, setCachedData } = require('../services/cache');
const { logger } = require('../services/logger');

const router = express.Router();

router.post('/:id/verify-image', async (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;
  const cacheKey = `verify:${image_url}`;

  const cached = await getCachedData(cacheKey);
  if (cached) {
    logger.info(`Cache hit for image verification: ${image_url}`);
    return res.json(cached);
  }

  try {
    const result = await verifyImage(image_url);
    await setCachedData(cacheKey, result, 3600);
    logger.info(`Image verified: ${image_url}`);
    res.json(result);
  } catch (error) {
    logger.error(`Image verification failed: ${error.message}`);
    res.status(500).json({ error: 'Image verification failed' });
  }
});

module.exports = router;