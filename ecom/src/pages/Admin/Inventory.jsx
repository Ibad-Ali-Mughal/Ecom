// // import { useEffect, useState } from 'react';
// // // Updated path: Up from Admin folder, Up from Pages folder, to the src folder
// // import { supabase } from '../../supabaseClient'; 

// // export default function Inventory() {
// //   const [inventory, setInventory] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchInventory = async () => {
// //     setLoading(true);
// //     const { data, error } = await supabase
// //       .from('products')
// //       .select(`
// //         id,
// //         title,
// //         product_variants (
// //           id,
// //           size,
// //           color,
// //           stock
// //         )
// //       `);

// //     if (error) {
// //       console.error("Error fetching inventory:", error.message);
// //     } else {
// //       setInventory(data);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchInventory();
// //   }, []);

// //   if (loading) return <div className="p-10 text-center font-bold">Loading Inventory...</div>;

// //   return (
// //     <div className="p-8 space-y-8 bg-[#FBFBFB] min-h-screen">
// //       <h1 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Stock</h1>
      
// //       <div className="grid gap-8">
// //         {inventory.map((product) => (
// //           <div key={product.id} className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm">
// //             <div className="mb-6 border-b pb-4">
// //               <h2 className="text-2xl font-black uppercase tracking-tight">{product.title}</h2>
// //               <p className="text-gray-400 text-[10px] font-bold uppercase">Article ID: {product.id.slice(0,8)}</p>
// //             </div>
            
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //               {product.product_variants && product.product_variants.length > 0 ? (
// //                 product.product_variants.map((variant) => (
// //                   <div 
// //                     key={variant.id} 
// //                     className={`p-6 rounded-[20px] border transition-all ${
// //                       variant.stock <= 5 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
// //                     }`}
// //                   >
// //                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
// //                       Size: {variant.size || 'N/A'} {variant.color ? `| ${variant.color}` : ''}
// //                     </p>
// //                     <div className="flex items-baseline gap-2">
// //                       <p className={`text-4xl font-black ${variant.stock <= 5 ? 'text-red-600' : 'text-black'}`}>
// //                         {variant.stock}
// //                       </p>
// //                       <p className="text-xs font-bold text-gray-500 uppercase">Left</p>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p className="text-gray-400 italic text-sm">No stock data available.</p>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient'; 
// import { FiPlus, FiMinus, FiXCircle } from 'react-icons/fi';

// export default function Inventory() {
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchInventory = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('products')
//       .select(`
//         id,
//         title,
//         product_variants (
//           id,
//           size,
//           color,
//           stock
//         )
//       `);

//     if (error) console.error("Error fetching inventory:", error.message);
//     else setInventory(data);
//     setLoading(false);
//   };

//   // Function to update stock in database
//   const updateStock = async (variantId, newStock) => {
//     const finalStock = Math.max(0, newStock); // Ensure stock never goes below 0

//     // Optimistic Update: Update UI immediately
//     setInventory(prev => prev.map(product => ({
//       ...product,
//       product_variants: product.product_variants.map(v => 
//         v.id === variantId ? { ...v, stock: finalStock } : v
//       )
//     })));

//     const { error } = await supabase
//       .from('product_variants')
//       .update({ stock: finalStock })
//       .eq('id', variantId);

//     if (error) {
//       alert("Failed to update stock");
//       fetchInventory(); // Revert on error
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   if (loading) return <div className="p-10 text-center font-bold uppercase italic">Updating Warehouse...</div>;

//   return (
//     <div className="p-8 space-y-8 bg-[#FBFBFB] min-h-screen">
//       <h1 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Control</h1>
      
//       <div className="grid gap-8">
//         {inventory.map((product) => (
//           <div key={product.id} className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm">
//             <div className="mb-6 border-b pb-4">
//               <h2 className="text-2xl font-black uppercase tracking-tight">{product.title}</h2>
//               <p className="text-gray-400 text-[10px] font-bold uppercase">Article ID: {product.id.slice(0,8)}</p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {product.product_variants?.map((variant) => (
//                 <div 
//                   key={variant.id} 
//                   className={`p-6 rounded-[24px] border transition-all ${
//                     variant.stock === 0 ? 'bg-gray-100 opacity-60' : 
//                     variant.stock <= 5 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
//                   }`}
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                         Size: {variant.size || 'N/A'} {variant.color ? `| ${variant.color}` : ''}
//                       </p>
//                       <div className="flex items-baseline gap-2">
//                         <p className={`text-4xl font-black ${variant.stock <= 5 ? 'text-red-600' : 'text-black'}`}>
//                           {variant.stock}
//                         </p>
//                         <p className="text-xs font-bold text-gray-500 uppercase">In Stock</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* CONTROL BUTTONS */}
//                   <div className="flex gap-2 mt-4">
//                     <button 
//                       onClick={() => updateStock(variant.id, variant.stock - 1)}
//                       className="flex-1 bg-white border border-gray-200 h-10 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors"
//                     >
//                       <FiMinus />
//                     </button>
//                     <button 
//                       onClick={() => updateStock(variant.id, variant.stock + 1)}
//                       className="flex-1 bg-white border border-gray-200 h-10 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors"
//                     >
//                       <FiPlus />
//                     </button>
//                     <button 
//                       onClick={() => updateStock(variant.id, 0)}
//                       className="flex-1 bg-red-100 text-red-600 border border-red-200 h-10 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
//                       title="Mark Out of Stock"
//                     >
//                       <FiXCircle />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; 
import { FiPlus, FiMinus, FiXCircle, FiTrash2 } from 'react-icons/fi'; // Added FiTrash2

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        images,
        product_variants (
          id,
          size,
          color,
          stock
        )
      `)
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching inventory:", error.message);
    else setInventory(data);
    setLoading(false);
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product and all its variants?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      setInventory(prev => prev.filter(p => p.id !== productId));
    }
  };

  const updateStock = async (variantId, newStock) => {
    const finalStock = Math.max(0, newStock);

    setInventory(prev => prev.map(product => ({
      ...product,
      product_variants: product.product_variants.map(v => 
        v.id === variantId ? { ...v, stock: finalStock } : v
      )
    })));

    const { error } = await supabase
      .from('product_variants')
      .update({ stock: finalStock })
      .eq('id', variantId);

    if (error) {
      alert("Failed to update stock");
      fetchInventory();
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold uppercase italic">Updating Warehouse...</div>;

  return (
    <div className="p-8 space-y-8 bg-[#FBFBFB] min-h-screen">
      <h1 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Control</h1>
      
      <div className="grid gap-8">
        {inventory.map((product) => (
          <div key={product.id} className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm relative group">
            
            <button 
              onClick={() => deleteProduct(product.id)}
              className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-600 transition-colors"
              title="Delete Product"
            >
              <FiTrash2 size={20} />
            </button>

            <div className="mb-6 border-b pb-4 flex items-center gap-6">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="w-20 h-20 object-cover rounded-2xl bg-gray-50"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-[10px] text-gray-400">NO IMG</div>
              )}

              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">{product.title}</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase">Article ID: {product.id.slice(0,8)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.product_variants?.map((variant) => (
                <div 
                  key={variant.id} 
                  className={`p-6 rounded-3xl border transition-all ${
                    variant.stock === 0 ? 'bg-gray-100 opacity-60' : 
                    variant.stock <= 5 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Size: {variant.size || 'N/A'} {variant.color ? `| ${variant.color}` : ''}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-4xl font-black ${variant.stock <= 5 ? 'text-red-600' : 'text-black'}`}>
                          {variant.stock}
                        </p>
                        <p className="text-xs font-bold text-gray-500 uppercase">In Stock</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => updateStock(variant.id, variant.stock - 1)}
                      className="flex-1 bg-white border border-gray-200 h-10 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                      <FiMinus />
                    </button>
                    <button 
                      onClick={() => updateStock(variant.id, variant.stock + 1)}
                      className="flex-1 bg-white border border-gray-200 h-10 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                      <FiPlus />
                    </button>
                    <button 
                      onClick={() => updateStock(variant.id, 0)}
                      className="flex-1 bg-red-100 text-red-600 border border-red-200 h-10 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <FiXCircle />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}