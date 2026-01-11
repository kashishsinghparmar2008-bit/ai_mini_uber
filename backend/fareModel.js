// backend/fareModel.js

const pastRides = [
  { distance: 5, fare: 120 },
  { distance: 8, fare: 180 },
  { distance: 10, fare: 230 },
  { distance: 12, fare: 260 },
  { distance: 15, fare: 320 }
];

// Simple ML-style prediction (average rate per km)
function predictFare(distance) {
  let totalDistance = 0;
  let totalFare = 0;

  for (let ride of pastRides) {
    totalDistance += ride.distance;
    totalFare += ride.fare;
  }

  const ratePerKm = totalFare / totalDistance;
  const predictedFare = distance * ratePerKm;

  return Math.round(predictedFare);
}

module.exports = predictFare;
