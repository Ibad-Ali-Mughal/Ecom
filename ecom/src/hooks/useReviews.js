import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useUserReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        is_verified_purchase,
        created_at,
        profiles(username)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  return { reviews, loading, refresh: fetchReviews };
};
