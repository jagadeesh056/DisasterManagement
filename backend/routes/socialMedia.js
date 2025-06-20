const express = require('express');
const { getCachedData, setCachedData } = require('../services/cache');
const { logger } = require('../services/logger');

const router = express.Router();

const mockSocialMedia = [
  { post: '#floodrelief Need food in NYC', user: 'citizen1', created_at: new Date().toISOString() },
  { post: 'Shelter available in Lower East Side #floodrelief', user: 'reliefOrg', created_at: new Date().toISOString() },
];

router.get('/:id/social-media', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `social-media:${id}`;

  const cached = await getCachedData(cacheKey);
  if (cached) {
    logger.info(`Cache hit for social media: ${id}`);
    return res.json(cached);
  }

  const data = mockSocialMedia;
  await setCachedData(cacheKey, data, 3600);
  logger.info(`Fetched social media for disaster: ${id}`);
  req.io.emit('social_media_updated', { disaster_id: id, data });
  res.json(data);
});

module.exports = router;