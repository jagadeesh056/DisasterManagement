const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const { authenticate } = require('../middleware/auth');
const { supabase: config } = require('../config/config');
const { logger } = require('../services/logger');

const router = express.Router();
const supabase = createClient(config.url, config.key);

router.post('/:id/reports', authenticate, async (req, res) => {
  const { id: disaster_id } = req.params;
  const { content, image_url } = req.body;
  const { user } = req;

  const { data, error } = await supabase.from('reports').insert({
    id: uuidv4(),
    disaster_id,
    user_id: user.id,
    content,
    image_url,
    verification_status: 'pending',
    created_at: new Date().toISOString(),
  }).select().single();

  if (error) {
    logger.error(`Report creation failed: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }

  logger.info(`Report created for disaster: ${disaster_id} by ${user.id}`);
  req.io.emit('report_updated', data);
  res.status(201).json(data);
});

router.get('/:id/reports', async (req, res) => {
  const { id: disaster_id } = req.params;

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('disaster_id', disaster_id);

  if (error) {
    logger.error(`Report query failed: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;