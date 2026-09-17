import axios from 'axios';

/**
 * Real Axios API Client
 * Configured via environment variable VITE_API_URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL || '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

/**
 * Send ride prediction payload to the ML backend
 * Endpoint: POST /api/predict
 * 
 * @param {Object} rideData
 * @returns {Promise<{ predicted_price: number }>}
 */
export const predictCabPrice = async (rideData) => {
  const formattedPayload = {
    cab_type: String(rideData.cab_type),
    name: String(rideData.name),
    distance: parseFloat(rideData.distance),
    surge_multiplier: parseFloat(rideData.surge_multiplier),
    source: String(rideData.source),
    destination: String(rideData.destination),
    hour: parseInt(rideData.hour, 10),
    day: parseInt(rideData.day, 10),
    month: parseInt(rideData.month, 10),
    temperature: parseFloat(rideData.temperature),
    short_summary: String(rideData.short_summary),
    precipIntensity: parseFloat(rideData.precipIntensity),
  };

  const response = await apiClient.post('/api/predict', formattedPayload);
  return response.data;
};

export default apiClient;
