import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useResumeAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (resumeText) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/analyze_resume', {
        resume_text: resumeText,
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

  return { data, loading, error, analyze };
};
