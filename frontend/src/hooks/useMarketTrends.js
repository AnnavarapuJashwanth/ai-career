import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useMarketTrends = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (role, location = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/market_trends', {
        params: { role, location },
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetch };
};
