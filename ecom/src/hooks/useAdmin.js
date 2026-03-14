

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      localStorage.removeItem('isAdmin'); 
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isRoleAdmin = profile?.role === 'admin';
    setIsAdmin(isRoleAdmin);
    
    if (isRoleAdmin) {
      localStorage.setItem('isAdmin', 'true'); 
    } else {
      localStorage.removeItem('isAdmin');
    }
  }, []);

  useEffect(() => {
    checkAdmin();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });
    return () => {
      if (listener?.subscription) listener.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const generateSlug = (title) => `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  const fetchStats = useCallback(async () => {
    const adminCheck = isAdmin || localStorage.getItem('isAdmin') === 'true';
    if (!adminCheck) return { revenue: 0, totalOrders: 0 };

    const { data, error } = await supabase
      .from('orders')
      .select('total_amount'); 

    if (error) {
      console.error("Stats fetch error:", error);
      return { revenue: 0, totalOrders: 0 };
    }

    const revenue = data.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    return { revenue, totalOrders: data.length };
  }, [isAdmin]);

  const publishProduct = async (productData, variants) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    setLoading(true);
    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert([{
          title: productData.title,
          slug: generateSlug(productData.title),
          description: productData.description,
          price: Number(productData.price),
          images: productData.images || [],
          colors: productData.colors || {}, // JSON for color-specific grouping
          category_id: productData.category_id || null,
          discount_percent: Number(productData.discount) || 0
        }])
        .select()
        .single();

      if (error) throw error;

      if (variants?.length) {
        const rows = variants.map(v => ({
          product_id: product.id,
          variant_type: v.variant_type || 'size',
          name: v.name,
          color: v.color || null,
          size: v.size || v.name,
          stock: Number(v.stock) || 0
        }));
        await supabase.from('product_variants').insert(rows);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  
  const updateProduct = async (productId, productData, variants) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    setLoading(true);

    try {
      const { error: productError } = await supabase
        .from('products')
        .update({
          title: productData.title,
          description: productData.description,
          price: Number(productData.price),
          images: productData.images, 
          category_id: productData.category_id || null,
          discount_percent: Number(productData.discount_percent || productData.discount) || 0,
        })
        .eq('id', productId);

      if (productError) throw productError;

      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId);

      if (deleteError) throw deleteError;

      if (variants?.length) {
        const rows = variants.map(v => ({
          product_id: productId,
          variant_type: v.variant_type || 'size',
          name: v.name,
          color: v.color || null,
          size: v.size || v.name,
          stock: Number(v.stock) || 0
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(rows);

        if (variantError) throw variantError;
      }

      return { success: true };
    } catch (err) {
      console.error("Update Error:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Delete Error:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { 
    isAdmin, 
    loading, 
    publishProduct, 
    updateProduct, 
    deleteProduct, 
    fetchStats 
  };
};



// last fully used completly working
// import { useState, useEffect, useCallback } from 'react';
// import { supabase } from '../supabaseClient';

// export const useAdmin = () => {
//   const [loading, setLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const checkAdmin = useCallback(async () => {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//       setIsAdmin(false);
//       localStorage.removeItem('isAdmin'); 
//       return;
//     }

//     const { data: profile } = await supabase
//       .from('profiles')
//       .select('role')
//       .eq('id', user.id)
//       .maybeSingle();

//     const isRoleAdmin = profile?.role === 'admin';
//     setIsAdmin(isRoleAdmin);
    
//     if (isRoleAdmin) {
//       localStorage.setItem('isAdmin', 'true'); 
//     } else {
//       localStorage.removeItem('isAdmin');
//     }
//   }, []);

//   useEffect(() => {
//     checkAdmin();
//     const { data: listener } = supabase.auth.onAuthStateChange(() => {
//       checkAdmin();
//     });
//     return () => {
//       if (listener?.subscription) listener.subscription.unsubscribe();
//     };
//   }, [checkAdmin]);

//   // 💰 REVENUE LOGIC: Restored to your working version
//   const fetchStats = useCallback(async () => {
//     // Check local storage as a fallback so stats fetch immediately on new tabs
//     const adminCheck = isAdmin || localStorage.getItem('isAdmin') === 'true';
//     if (!adminCheck) return { revenue: 0, totalOrders: 0 };

//     const { data, error } = await supabase
//       .from('orders')
//       .select('total_amount'); 

//     if (error) {
//       console.error("Stats fetch error:", error);
//       return { revenue: 0, totalOrders: 0 };
//     }

//     const revenue = data.reduce(
//       (sum, order) => sum + Number(order.total_amount || 0),
//       0
//     );

//     return {
//       revenue,
//       totalOrders: data.length
//     };
//   }, [isAdmin]);

//   const generateSlug = (title) => `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

//   const publishProduct = async (productData, variants) => {
//     if (!isAdmin) return { success: false, error: 'Unauthorized' };
//     setLoading(true);
//     try {
//       const { data: product, error } = await supabase
//         .from('products')
//         .insert([{
//           title: productData.title,
//           slug: generateSlug(productData.title),
//           description: productData.description,
//           price: Number(productData.price),
//           images: productData.images || {},
//           category_id: productData.category_id || null,
//           discount_percent: Number(productData.discount) || 0
//         }])
//         .select()
//         .single();

//       if (error) throw error;

//       if (variants?.length) {
//         const rows = variants.map(v => ({
//           product_id: product.id,
//           variant_type: v.variant_type,
//           name: v.name,
//           color: v.color || null,
//           size: v.size || null,
//           stock: Number(v.stock) || 0
//         }));
//         await supabase.from('product_variants').insert(rows);
//       }
//       return { success: true };
//     } catch (err) {
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { isAdmin, loading, publishProduct, fetchStats };
// };



















































// import { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';

// export const useAdmin = () => {
//   const [loading, setLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // ---------------------------
//   // CHECK ADMIN ROLE
//   // ---------------------------
//   const checkAdmin = async () => {
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//       setIsAdmin(false);
//       return;
//     }

//     const { data: profile, error } = await supabase
//       .from('profiles')
//       .select('role')
//       .eq('id', user.id)
//       .maybeSingle();

//     if (error || !profile) {
//       setIsAdmin(false);
//       return;
//     }

//     setIsAdmin(profile.role === 'admin');
//   };

//   useEffect(() => {
//     checkAdmin();

//     const { data: listener } = supabase.auth.onAuthStateChange(() => {
//       checkAdmin();
//     });

//     return () => {
//       if (listener?.subscription) {
//         listener.subscription.unsubscribe();
//       }
//     };
//   }, []);

//   // ---------------------------
//   // FETCH DASHBOARD STATS (FIXED)
//   // ---------------------------
// const fetchStats = async () => {
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return { revenue: 0, totalOrders: 0 };

//   // We use the exact labels found in your enum query
//   const { data, error } = await supabase
//     .from('orders')
//     .select('total_amount')
//     .in('status', ['processing', 'shipped', 'delivered']);

//   if (error) {
//     console.error('Stats error:', error);
//     return { revenue: 0, totalOrders: 0 };
//   }

//   const revenue = data.reduce(
//     (sum, order) => sum + Number(order.total_amount || 0),
//     0
//   );

//   return {
//     revenue,
//     totalOrders: data.length
//   };
// };

//   // ---------------------------
//   // PRODUCT PUBLISH
//   // ---------------------------
//   const generateSlug = (title) =>
//     `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

//   const publishProduct = async (productData, variants) => {
//     // Double check auth inside function for security
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { success: false, error: 'Not authenticated' };

//     setLoading(true);

//     try {
//       const { data: product, error } = await supabase
//         .from('products')
//         .insert([{
//           title: productData.title,
//           slug: generateSlug(productData.title),
//           description: productData.description,
//           price: Number(productData.price),
//           images: productData.images || {},
//           category_id: productData.category_id || null,
//           discount_percent: Number(productData.discount) || 0
//         }])
//         .select()
//         .single();

//       if (error) throw error;

//       if (variants?.length) {
//         const rows = variants.map(v => ({
//           product_id: product.id,
//           variant_type: v.variant_type,
//           name: v.name,
//           color: v.color || null,
//           size: v.size || null,
//           stock: Number(v.stock) || 0
//         }));

//         const { error: vError } = await supabase
//           .from('product_variants')
//           .insert(rows);

//         if (vError) throw vError;
//       }

//       return { success: true };
//     } catch (err) {
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     isAdmin,
//     loading,
//     publishProduct,
//     fetchStats
//   };
// };