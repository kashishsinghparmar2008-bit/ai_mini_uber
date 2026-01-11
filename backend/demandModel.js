// backend/demandModel.js

const rideHistory = [];

function addRide(pickup) {
  rideHistory.push(pickup);
}

function getHighDemandArea() {
  const count = {};

  for (let area of rideHistory) {
    count[area] = (count[area] || 0) + 1;
  }

  let maxArea = null;
  let maxCount = 0;

  for (let area in count) {
    if (count[area] > maxCount) {
      maxCount = count[area];
      maxArea = area;
    }
  }

  return maxArea;
}

function getHeatmapData() {
  return rideHistory;
}

module.exports = {
  addRide,
  getHighDemandArea,
  getHeatmapData
};

