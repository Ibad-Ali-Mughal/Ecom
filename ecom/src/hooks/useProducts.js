
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            ),
            product_variants (
              id,
              variant_type,
              name,
              size,
              color,
              stock
            )
          `);

        if (catError) throw catError;
        if (prodError) throw prodError;

        setCategories(catData || []);
        setProducts(prodData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, categories, loading, error };
};
