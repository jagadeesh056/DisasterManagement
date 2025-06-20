const fetchOfficialUpdates = async (disasterId) => {
  return [{ source: 'FEMA', content: 'Emergency shelters open in NYC', timestamp: new Date().toISOString() }];
};

module.exports = { fetchOfficialUpdates };