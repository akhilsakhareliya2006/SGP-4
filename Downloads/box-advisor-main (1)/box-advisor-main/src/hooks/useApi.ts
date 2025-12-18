import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export function useBoxes(params: Parameters<typeof apiService.getBoxes>[0] = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.getBoxes(params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch boxes');
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: () => setData(null) };
}

export function useBox(id: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBox = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.getBox(id);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch box');
      } finally {
        setLoading(false);
      }
    };

    fetchBox();
  }, [id]);

  return { data, loading, error };
}

export function useBoxReviews(boxId: string, params: { page?: number; limit?: number } = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boxId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.getBoxReviews(boxId, params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [boxId, JSON.stringify(params)]);

  return { data, loading, error, refetch: () => setData(null) };
}

export function useDashboardStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.getDashboardStats();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading, error };
}