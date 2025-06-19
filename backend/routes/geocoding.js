const express = require('express');
const { getLocationFromText } = require('../services/gemini');
const { geocodeLocation } = require('../services/mapbox');
const { getCachedData, setCachedData } = require('../services/cache');
const { logger } = require('../services/logger');

const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;
  const cacheKey = `geocode:${text}`;

  const cached = await getCachedData(cacheKey);
  if (cached) {
    logger.info(`Cache hit for geocoding: ${text}`);
    return res.json(cached);
  }

  try {
    const locationName = await getLocationFromText(text);
    if (!locationName) {
      return res.status(400).json({ error: 'No location found in text' });
    }

    const coordinates = await geocodeLocation(locationName);
    const result = { location_name: locationName, ...coordinates };

    await setCachedData(cacheKey, result, 3600);
    logger.info(`Geocoded location: ${locationName}`);
    res.json(result);
  } catch (error) {
    logger.error(`Geocoding failed: ${error.message}`);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

module.exports = router;