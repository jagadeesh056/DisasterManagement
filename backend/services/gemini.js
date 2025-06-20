const { GoogleGenerativeAI } = require('@google/generative-ai');
const { logger } = require('./logger');

const { GEMINI_API_KEY } = process.env;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function getLocationFromText(text) {
  logger.info(`Extracting location from text: ${text}`);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Extract the location name from the following text as a single string. If no location is found, return an empty string: "${text}"`;
    const result = await model.generateContent(prompt);
    const location = result.response.text().trim();
    logger.info(`Gemini extracted location: ${location}`);
    return location || null;
  } catch (error) {
    logger.error(`Gemini API error in getLocationFromText: ${error.message}`);
    return null;
  }
}

const verifyImage = async (image_url) => {
  logger.info(`Mock verifying image: ${image_url}`);
  return { status: 'verified', confidence: 0.9 };
};

module.exports = { getLocationFromText, verifyImage };