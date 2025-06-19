module.exports = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  mapbox: {
    accessToken: process.env.MAPBOX_ACCESS_TOKEN,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  mockUsers: [
    { id: 'netrunnerX', role: 'admin' },
    { id: 'reliefAdmin', role: 'contributor' },
  ],
};