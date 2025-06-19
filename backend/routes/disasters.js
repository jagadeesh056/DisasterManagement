const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const { authenticate } = require('../middleware/auth');
const { supabase: config } = require('../config/config');
const { logger } = require('../services/logger');

const router = express.Router();
const supabase = createClient(config.url, config.key);

router.post('/', authenticate, async (req, res) => {
  const { title, location_name, description, tags } = req.body;
  const { user } = req;

  const audit_trail = [{
    action: 'create',
    user_id: user.id,
    timestamp: new Date().toISOString(),
  }];

  const { data, error } = await supabase.from('disasters').insert({
    id: uuidv4(),
    title,
    location_name,
    description,
    tags,
    owner_id: user.id,
    audit_trail,
  }).select().single();

  if (error) {
    logger.error(`Disaster creation failed: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }

  logger.info(`Disaster created: ${title} by ${user.id}`);
  req.io.emit('disaster_updated', data);
  res.status(201).json(data);
});

router.get('/', async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description, tags } = req.body;
  const { user } = req;

  const { data: existing } = await supabase
    .from('disasters')
    .select('audit_trail')
    .eq('id', id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Disaster not found' });

  const audit_trail = [
    ...existing.audit_trail,
    { action: 'update', user_id: user.id, timestamp: new Date().toISOString() },
  ];

  const { data, error } = await supabase
    .from('disasters')
    .update({ title, location_name, description, tags, audit_trail })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  logger.info(`Disaster updated: ${id} by ${user.id}`);
  req.io.emit('disaster_updated', data);
  res.json(data);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const { error } = await supabase
    .from('disasters')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  logger.info(`Disaster deleted: ${id} by ${user.id}`);
  req.io.emit('disaster_updated', { id, deleted: true });
  res.status(204).send();
});

module.exports = router;