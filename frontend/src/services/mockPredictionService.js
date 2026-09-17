/**
 * Mock Prediction Service
 * 
 * Strictly separated fallback service used ONLY when Mock Mode is active
 * or when testing the frontend without an active backend server.
 * Does NOT touch or modify the production API client.
 */

const BASE_RATES = {
  // Uber rates
  'UberX': { base: 6.5, perMile: 2.15 },
  'UberXL': { base: 10.5, perMile: 3.25 },
  'Black': { base: 16.0, perMile: 4.50 },
  'Black SUV': { base: 22.0, perMile: 5.60 },
  'UberPool': { base: 5.0, perMile: 1.60 },
  'WAV': { base: 6.5, perMile: 2.15 },
  'Taxi': { base: 8.0, perMile: 2.80 },

  // Lyft rates
  'Lyft': { base: 6.5, perMile: 2.15 },
  'Lyft XL': { base: 10.5, perMile: 3.25 },
  'Lux': { base: 15.0, perMile: 4.25 },
  'Lux Black': { base: 20.0, perMile: 5.20 },
  'Lux Black XL': { base: 26.0, perMile: 6.00 },
  'Shared': { base: 5.0, perMile: 1.60 }
};

export const mockPredictCabPrice = async (payload) => {
  // Simulate network latency of 700ms for realistic UI testing
  await new Promise((resolve) => setTimeout(resolve, 700));

  const tier = BASE_RATES[payload.name] || { base: 7.0, perMile: 2.2 };
  const distance = Number(payload.distance) || 3.0;
  const surge = Number(payload.surge_multiplier) || 1.0;
  const precip = Number(payload.precipIntensity) || 0;

  // Rain / weather bump
  const weatherFactor = precip > 0.05 ? 1.08 : 1.0;

  // Peak hour bump (7-9 AM or 5-7 PM)
  const hour = Number(payload.hour);
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  const rushFactor = isRushHour ? 1.12 : 1.0;

  const rawFare = (tier.base + (distance * tier.perMile * weatherFactor * rushFactor)) * surge;
  const predictedPrice = Math.max(5.0, parseFloat(rawFare.toFixed(2)));

  return {
    predicted_price: predictedPrice,
    is_mock: true
  };
};
