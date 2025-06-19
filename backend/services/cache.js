const { createClient } = require('@supabase/supabase-js');
const { supabase: config } = require('../config/config');

const supabase = createClient(config.url, config.key);

const getCachedData = async (key) => {
  const { data } = await supabase
    .from('cache')
    .select('value')
    .eq('key', key)
    .gte('expires_at', new Date().toISOString())
    .single();

  return data?.value;
};

const setCachedData = async (key, value, ttl) => {
  const expires_at = new Date(Date.now() + ttl * 1000).toISOString();
  await supabase
    .from('cache')
    .upsert({ key, value, expires_at });
};

module.exports = { getCachedData, setCachedData };