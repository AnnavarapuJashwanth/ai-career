import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useRoadmapGeneration = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/generate_roadmap', params);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, generate };
};
