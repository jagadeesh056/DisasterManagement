const { logger } = require('./logger');

const { MAPBOX_ACCESS_TOKEN } = process.env;

async function geocodeLocation(locationName) {
  logger.info(`Geocoding location: ${locationName}`);
  try {
    const encodedLocation = encodeURIComponent(locationName);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      throw new Error('No geocoding results found');
    }
    
    const [longitude, latitude] = data.features[0].center;
    const result = { latitude, longitude };
    
    logger.info(`Mapbox geocoded ${locationName} to: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    logger.error(`Mapbox geocoding failed for ${locationName}: ${error.message}`);
    throw error; // Let the caller handle the error
  }
}

module.exports = { geocodeLocation };