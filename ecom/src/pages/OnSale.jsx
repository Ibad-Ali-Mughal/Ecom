// import { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient';
// import { FiTag, FiArrowRight, FiLoader, FiAlertCircle } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// export default function OnSale() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchSaleProducts() {
//       try {
//         setLoading(true);
//         // MATCHING SQL: Using 'discount_percent' column
//         const { data, error } = await supabase
//           .from('products')
//           .select('*')
//           .gt('discount_percent', 0) 
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setProducts(data || []);
//       } catch (err) {
//         console.error("Error fetching sale items:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSaleProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-white">
//         <FiLoader className="animate-spin text-black" size={30} />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-10 bg-white min-h-screen">
//       {/* HEADER */}
//       <div className="mb-16">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="bg-red-500 text-white p-1 rounded">
//             <FiTag size={14} />
//           </div>
//           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
//             Exclusive Deals
//           </span>
//         </div>
//         <h1 className="text-6xl font-black italic uppercase tracking-tighter">
//           Clearance <span className="text-gray-200">Archive</span>
//         </h1>
//       </div>

//       {products.length === 0 ? (
//         <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
//           <FiAlertCircle className="mx-auto text-gray-200 mb-4" size={40} />
//           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active discounts found</p>
//           <p className="text-[10px] text-gray-300 uppercase mt-2 font-bold">Items must have discount_percent  0</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {products.map((product) => {
//             // FIX: Accessing 'discount_percent' instead of 'discount'
//             const originalPrice = Number(product.price);
//             const discountPercent = Number(product.discount_percent) || 0;
//             const salePrice = originalPrice - (originalPrice * (discountPercent / 100));
            
//             return (
//               <Link 
//                 key={product.id} 
//                 to={`/product/${product.slug}`}
//                 className="group relative bg-gray-50 rounded-[32px] overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1"
//               >
//                 {/* DISCOUNT BADGE */}
//                 <div className="absolute top-6 left-6 z-10 bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
//                   -{discountPercent}% OFF
//                 </div>

//                 {/* IMAGE: Handling JSONB array from your SQL */}
//                 <div className="aspect-[4/5] overflow-hidden bg-gray-200">
//                   <img 
//                     src={Array.isArray(product.images) ? product.images[0] : 'https://via.placeholder.com/400x500'} 
//                     alt={product.title}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                 </div>

//                 {/* INFO */}
//                 <div className="p-8">
//                   <h3 className="text-xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-600 transition-colors">
//                     {product.title}
//                   </h3>
                  
//                   <div className="flex items-end justify-between">
//                     <div>
//                       <p className="text-[10px] text-gray-400 font-bold uppercase line-through mb-1">
//                         Rs. {originalPrice.toLocaleString()}
//                       </p>
//                       <p className="text-2xl font-black tracking-tighter">
//                         Rs. {Math.floor(salePrice).toLocaleString()}
//                       </p>
//                     </div>
                    
//                     <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-all group-hover:rotate-[-10deg]">
//                       <FiArrowRight size={20} />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  FiTag,
  FiArrowRight,
  FiLoader,
  FiAlertCircle,
  FiEdit
} from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OnSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading: authLoading } = useAuth();

  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
  const isAdmin = !authLoading && profile?.role === 'admin';
  const showAdminControls = isAdmin && isPreview;

  useEffect(() => {
    async function fetchSaleProducts() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('discount_percent', 0)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching sale items:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSaleProducts();
  }, []);

  if (loading || authLoading) {
    return (
       <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Syncing Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-white min-h-screen">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-red-500 text-white p-1 rounded">
            <FiTag size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Exclusive Deals
          </span>
        </div>
        <h1 className="text-6xl font-black italic uppercase tracking-tighter">
          Clearance <span className="text-gray-200">Archive</span>
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[40px] bg-gray-50/50">
          <FiAlertCircle className="mx-auto text-gray-200 mb-4" size={40} />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            No active discounts found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const originalPrice = Number(product.price);
            const discountPercent = Number(product.discount_percent) || 0;
            const salePrice =
              originalPrice - originalPrice * (discountPercent / 100);

            return (
              <div
                key={product.id}
                className="relative group bg-gray-50 rounded-[32px] overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                {showAdminControls && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/admin/products/edit/${product.id}`);
                    }}
                    className="absolute top-6 right-6 z-20
                      bg-blue-600 text-white p-2 rounded-full
                      shadow-lg hover:bg-blue-700 transition"
                    title="Edit Product"
                  >
                    <FiEdit size={14} />
                  </button>
                )}

                <div className="absolute top-6 left-6 z-10 bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                  -{discountPercent}% OFF
                </div>

                <Link to={`/product/${product.slug}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-200">
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : 'https://via.placeholder.com/400x500'
                      }
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl font-black uppercase italic leading-tight mb-4 group-hover:text-red-600 transition-colors">
                      {product.title}
                    </h3>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase line-through mb-1">
                          Rs. {originalPrice.toLocaleString()}
                        </p>
                        <p className="text-2xl font-black tracking-tighter">
                          Rs. {Math.floor(salePrice).toLocaleString()}
                        </p>
                      </div>

                      <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-all group-hover:rotate-[-10deg]">
                        <FiArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
