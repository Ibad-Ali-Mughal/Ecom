// import { useCart } from '../hooks/useCart';
// import { formatPKR } from '../utils/formatPrice';
// import { Link } from 'react-router-dom';

// export const CartPage = () => {
//   const { cartItems, removeFromCart, total } = useCart();

//   return (
//     <div className="pt-32 px-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-black uppercase tracking-tight mb-10 text-center">
//         Your Bag ({cartItems.length})
//       </h1>

//       {cartItems.length === 0 ? (
//         <div className="text-center py-24 uppercase text-[10px] tracking-widest">
//           Bag is empty
//         </div>
//       ) : (
//         <>
//           <div className="space-y-8">
//             {cartItems.map(item => (
//               <div key={item.variant_id} className="flex gap-6 border-b pb-8">
//                 <img src={item.image} className="w-24 h-32 object-cover" />
//                 <div className="flex-1">
//                   <h3 className="font-bold uppercase text-sm">
//                     {item.title}
//                   </h3>
//                   <p className="text-[10px] uppercase text-zinc-400 mt-1">
//                     Size: {item.variantName}
//                   </p>
//                   <p className="font-bold mt-3">
//                     {formatPKR(item.price)}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => removeFromCart(item.variant_id)}
//                   className="text-[10px] uppercase underline"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between items-end pt-10">
//             <div>
//               <p className="text-[10px] uppercase text-zinc-400 font-bold">
//                 Subtotal
//               </p>
//               <p className="text-3xl font-black italic">
//                 {formatPKR(total)}
//               </p>
//             </div>

//             <Link
//               to="/checkout"
//               className="bg-black text-white px-12 py-4 uppercase text-[10px] font-bold tracking-widest"
//             >
//               Checkout
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };



import { useCart } from '../hooks/useCart';
import { formatPKR } from '../utils/formatPrice';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-10 text-center italic">
        Your Bag ({cartItems.length})
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <p className="uppercase text-[10px] tracking-widest text-zinc-400 mb-8">Bag is empty</p>
          <Link to="/shop" className="border-b border-black pb-1 text-xs font-black uppercase">Start Shopping</Link>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {cartItems.map(item => (
              <div key={item.variant_id} className="flex gap-6 border-b border-zinc-100 pb-8 items-center">
                <div className="w-24 h-32 bg-zinc-50 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black uppercase text-sm tracking-tighter">{item.title}</h3>
                  <p className="text-[9px] font-bold uppercase text-zinc-400 mt-1 tracking-widest">
                    {item.variantName} {item.color ? `// ${item.color}` : ''}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center bg-zinc-100 rounded-full px-2">
                      <button 
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="p-2 disabled:opacity-20"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="p-2 disabled:opacity-20"
                        disabled={item.quantity >= item.stock}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-10">
                  <p className="font-black text-sm">
                    {formatPKR(Number(item.price) * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.variant_id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end pt-10 mt-6 border-t border-zinc-100 gap-8">
            <div>
              <p className="text-[10px] uppercase text-zinc-400 font-black mb-1 tracking-widest text-center sm:text-left">Estimated Total</p>
              <p className="text-5xl font-black italic tracking-tighter text-zinc-900">
                {formatPKR(total)}
              </p>
            </div>
            <Link
              to="/checkout"
              className="w-full sm:w-auto bg-black text-white px-16 py-5 uppercase text-xs font-black tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-2xl text-center"
            >
              Checkout Now
            </Link>
          </div>
        </>
      )}
    </div>
  );
};