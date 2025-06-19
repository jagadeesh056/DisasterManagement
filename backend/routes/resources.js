const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { supabase: config } = require('../config/config');
const { logger } = require('../services/logger');

const router = express.Router();
const supabase = createClient(config.url, config.key);

router.get('/:id/resources', async (req, res) => {
  const { id } = req.params;
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('disaster_id', id)
    .filter('location', 'st_dwithin', `ST_SetSRID(ST_Point(${lon},${lat}),4326),10000`);

  if (error) {
    logger.error(`Resource query failed: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }

  logger.info(`Resources fetched for disaster: ${id}`);
  req.io.emit('resources_updated', { disaster_id: id, data });
  res.json(data);
});

module.exports = router;