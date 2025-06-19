const express = require('express');
const { fetchOfficialUpdates } = require('../services/browse');
const { getCachedData, setCachedData } = require('../services/cache');
const { logger } = require('../services/logger');

const router = express.Router();

router.get('/:id/official-updates', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `updates:${id}`;

  const cached = await getCachedData(cacheKey);
  if (cached) {
    logger.info(`Cache hit for official updates: ${id}`);
    return res.json(cached);
  }

  try {
    const data = await fetchOfficialUpdates(id);
    await setCachedData(cacheKey, data, 3600);
    logger.info(`Fetched official updates for disaster: ${id}`);
    res.json(data);
  } catch (error) {
    logger.error(`Official updates failed: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

module.exports = router;