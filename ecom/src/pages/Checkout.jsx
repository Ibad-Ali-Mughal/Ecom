// import { useCart } from '../hooks/useCart';
// import { useAuth } from '../hooks/useAuth';
// import { supabase } from '../supabaseClient';
// import { formatPKR } from '../utils/formatPrice';

// export const Checkout = () => {
//   const { cartItems, total, clearCart } = useCart();
//   const { user } = useAuth();

//   const placeOrder = async () => {
//     const { data: order } = await supabase
//       .from('orders')
//       .insert({ user_id: user.id, total_amount: total })
//       .select()
//       .single();

//     await supabase.from('order_items').insert(
//       cartItems.map(i => ({
//         order_id: order.id,
//         product_id: i.product_id,
//         variant_id: i.variant_id,
//         qty: i.qty,
//         unit_price: i.price,
//       }))
//     );

//     clearCart();
//     window.location.href = '/orders';
//   };

//   return (
//     <div className="pt-32 px-6 max-w-2xl mx-auto space-y-12">
//       <h2 className="text-xl font-black uppercase tracking-widest text-center italic underline">
//         Cash on Delivery
//       </h2>

//       <div className="bg-zinc-50 p-8 space-y-6">
//         <p className="text-[10px] uppercase font-bold text-zinc-400">
//           Total Payable
//         </p>
//         <p className="text-4xl font-black italic">
//           {formatPKR(total)}
//         </p>
//         <button
//           onClick={placeOrder}
//           className="w-full bg-black text-white py-4 uppercase text-[10px] font-bold tracking-widest"
//         >
//           Place Order
//         </button>
//       </div>
//     </div>
//   );
// };


import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';
import { formatPKR } from '../utils/formatPrice';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('COD');

  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    state: 'Pakistan',
    zip: ''
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalOrder = async () => {
    if (!user) return alert('Please login first');
    if (cartItems.length === 0) return alert('Cart is empty');

    setLoading(true);

    try {
      const { data: address, error: addrErr } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          line1: addressData.line1,
          city: addressData.city,
          state: addressData.state,
          zip: addressData.zip,
          phone: addressData.phone,
          is_default: true
        })
        .select().single();

      if (addrErr) throw addrErr;

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          address_id: address.id,
          total_amount: Math.round(total),
          payment_method: method,
          payment_status: 'unpaid',
          status: 'processing',
          shipping_phone: addressData.phone
        })
        .select().single();

      if (orderErr) throw orderErr;

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(
          cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            qty: Number(item.quantity),
            unit_price: Number(item.price)
          }))
        );

      if (itemsErr) throw itemsErr;

      if (method === 'COD') {
        await Promise.all(
          cartItems.map(item =>
            supabase.rpc('decrement_stock', {
              row_id: item.variant_id,
              count: Number(item.quantity)
            })
          )
        );
        clearCart();
        navigate('/order-success');
      } else {
        
const res = await fetch(
  "https://mjpjlrxkrzwbjzrarkmy.supabase.co/functions/v1/swift-function",
  {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ 
      amount: Math.round(total * 100), 
      orderId: order.id 
    }),
  }
);

const data = await res.json();

if (!res.ok) {
  throw new Error(data.error || 'Payment service error');
}

if (data.url) {
  window.location.href = data.url;
}else {
          throw new Error("Stripe URL not returned from server");
        }
      }
    } catch (err) {
      console.error("Checkout process failed:", err);
      alert(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black italic uppercase">Checkout</h1>
        <div className="flex gap-2">
          <div className={`w-8 h-1 ${step >= 1 ? 'bg-black' : 'bg-zinc-200'}`} />
          <div className={`w-8 h-1 ${step >= 2 ? 'bg-black' : 'bg-zinc-200'}`} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          {step === 1 ? (
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <input required placeholder="Full Name"
                value={addressData.fullName}
                onChange={e => setAddressData({ ...addressData, fullName: e.target.value })}
                className="p-4 bg-zinc-50 rounded-xl w-full" />

              <input required placeholder="Phone"
                value={addressData.phone}
                onChange={e => setAddressData({ ...addressData, phone: e.target.value })}
                className="p-4 bg-zinc-50 rounded-xl w-full" />

              <input required placeholder="Address"
                value={addressData.line1}
                onChange={e => setAddressData({ ...addressData, line1: e.target.value })}
                className="p-4 bg-zinc-50 rounded-xl w-full" />

              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City"
                  value={addressData.city}
                  onChange={e => setAddressData({ ...addressData, city: e.target.value })}
                  className="p-4 bg-zinc-50 rounded-xl w-full" />

                <input required placeholder="Zip"
                  value={addressData.zip}
                  onChange={e => setAddressData({ ...addressData, zip: e.target.value })}
                  className="p-4 bg-zinc-50 rounded-xl w-full" />
              </div>

              <button className="w-full bg-black text-white py-5 rounded-full font-black">
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <button onClick={() => setMethod('COD')}
                className={`p-6 w-full border-2 rounded-xl text-left transition ${method === 'COD' ? 'bg-black text-white border-black' : 'border-zinc-200'}`}>
                <div className="font-bold uppercase italic">Cash on Delivery</div>
                <div className="text-xs opacity-60">Pay when you receive the package</div>
              </button>

              <button onClick={() => setMethod('STRIPE')}
                className={`p-6 w-full border-2 rounded-xl text-left transition ${method === 'STRIPE' ? 'bg-black text-white border-black' : 'border-zinc-200'}`}>
                <div className="font-bold uppercase italic">Credit / Debit Card</div>
                <div className="text-xs opacity-60">Secure payment via Stripe</div>
              </button>

              <button
                onClick={handleFinalOrder}
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic transition disabled:bg-zinc-400">
                {loading ? 'Processing...' : method === 'COD' ? 'Confirm Order' : 'Pay with Stripe'}
              </button>
              
              <button onClick={() => setStep(1)} className="w-full text-center text-sm text-zinc-400 underline">
                Back to Address
              </button>
            </div>
          )}
        </div>

        <div className="bg-zinc-50 p-8 rounded-3xl h-fit border border-zinc-100">
          <h2 className="font-bold mb-6 uppercase italic">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.variant_id} className="flex justify-between text-sm">
                <span className="text-zinc-600">{item.title} (x{item.quantity})</span>
                <span className="font-bold">{formatPKR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200 flex justify-between items-center font-black text-2xl italic">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
// before strip 
// import { useState } from 'react';
// import { useCart } from '../hooks/useCart';
// import { useAuth } from '../hooks/useAuth';
// import { supabase } from '../supabaseClient';
// import { formatPKR } from '../utils/formatPrice';
// import { useNavigate } from 'react-router-dom';

// export const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, total, clearCart } = useCart();
//   const { user } = useAuth();
  
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [method, setMethod] = useState('COD');
  
//   // Updated state to match your 'addresses' table schema
//   const [addressData, setAddressData] = useState({
//     fullName: '',
//     phone: '',
//     line1: '',
//     city: '',
//     state: 'Pakistan',
//     zip: ''
//   });

//   const handleAddressSubmit = (e) => {
//     e.preventDefault();
//     setStep(2);
//   };

//   const handleFinalOrder = async () => {
//     if (!user) return alert("Please login to complete your order.");
//     if (cartItems.length === 0) return alert("Your cart is empty.");

//     setLoading(true);
//     try {
//       // 1. SAVE TO ADDRESSES TABLE FIRST (Required by your schema)
//       const { data: address, error: addrErr } = await supabase
//         .from('addresses')
//         .insert({
//           user_id: user.id,
//           line1: addressData.line1,
//           city: addressData.city,
//           state: addressData.state,
//           zip: addressData.zip,
//           is_default: true
//         })
//         .select()
//         .single();

//       if (addrErr) throw addrErr;

//       if (method === 'COD') {
//         // 2. CREATE ORDER (Using the address.id we just created)
//         const { data: order, error: orderErr } = await supabase
//           .from('orders')
//           .insert({
//             user_id: user.id,
//             address_id: address.id, // Linked here
//             total_amount: total,
//             payment_method: 'COD',
//             payment_status: 'unpaid',
//             status: 'processing',
//             shipping_phone: addressData.phone
//           })
//           .select()
//           .single();

//         if (orderErr) throw orderErr;

//         // 3. INSERT ORDER ITEMS
//         const { error: itemsErr } = await supabase.from('order_items').insert(
//           cartItems.map(item => ({
//             order_id: order.id,
//             product_id: item.product_id,
//             variant_id: item.variant_id,
//             qty: Number(item.quantity),
//             unit_price: Number(item.price)
//           }))
//         );

//         if (itemsErr) throw itemsErr;

//         // 4. DECREMENT STOCK
//         await Promise.all(
//           cartItems.map(item => 
//             supabase.rpc('decrement_stock', { 
//               row_id: item.variant_id, 
//               count: Number(item.quantity) 
//             })
//           )
//         );

//         // 5. FINALIZE
//         clearCart();
//         navigate('/order-success');
//       } else {
//         // Stripe integration would happen here
//         console.log("Stripe payment initiated...");
//       }
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "An error occurred during checkout.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-32 px-6 max-w-4xl mx-auto pb-20">
//       <div className="flex justify-between items-center mb-12">
//         <h1 className="text-3xl font-black italic uppercase tracking-tighter">Checkout</h1>
//         <div className="flex gap-2">
//           <div className={`w-8 h-1 ${step >= 1 ? 'bg-black' : 'bg-zinc-200'}`} />
//           <div className={`w-8 h-1 ${step >= 2 ? 'bg-black' : 'bg-zinc-200'}`} />
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-16">
//         {/* LEFT: FORMS */}
//         <div>
//           {step === 1 ? (
//             <form onSubmit={handleAddressSubmit} className="space-y-6">
//               <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">01. Shipping Information</h2>
//               <div className="grid gap-4">
//                 <input required placeholder="Full Name" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                   onChange={e => setAddressData({...addressData, fullName: e.target.value})} value={addressData.fullName} />
                
//                 <input required placeholder="Phone Number" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                   onChange={e => setAddressData({...addressData, phone: e.target.value})} value={addressData.phone} />
                
//                 <input required placeholder="Shipping Address" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                   onChange={e => setAddressData({...addressData, line1: e.target.value})} value={addressData.line1} />
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <input required placeholder="City" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                     onChange={e => setAddressData({...addressData, city: e.target.value})} value={addressData.city} />
                  
//                   <input required placeholder="Zip Code" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                     onChange={e => setAddressData({...addressData, zip: e.target.value})} value={addressData.zip} />
//                 </div>
//               </div>
//               <button type="submit" className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-colors">
//                 Continue to Payment
//               </button>
//             </form>
//           ) : (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
//               <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">02. Payment Method</h2>
//               <div className="grid gap-4">
//                 <button onClick={() => setMethod('COD')} className={`p-6 border-2 rounded-2xl text-left transition-all ${method === 'COD' ? 'border-black bg-black text-white' : 'border-zinc-100'}`}>
//                   <p className="font-black italic uppercase">Cash on Delivery</p>
//                   <p className="text-[10px] opacity-60">Pay when you receive your bag.</p>
//                 </button>
//                 <button onClick={() => setMethod('STRIPE')} className={`p-6 border-2 rounded-2xl text-left transition-all ${method === 'STRIPE' ? 'border-black bg-black text-white' : 'border-zinc-100'}`}>
//                   <p className="font-black italic uppercase">Stripe / Credit Card</p>
//                   <p className="text-[10px] opacity-60">Secure online payment.</p>
//                 </button>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <button 
//                   onClick={handleFinalOrder} 
//                   disabled={loading} 
//                   className={`w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {loading ? 'Processing...' : method === 'COD' ? 'Confirm Order' : 'Pay Now'}
//                 </button>
//                 <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-zinc-400 text-center py-2">Back to Address</button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT: SUMMARY */}
//         <div className="bg-zinc-50 p-8 rounded-3xl h-fit sticky top-32">
//           <h2 className="text-xs font-black uppercase tracking-widest mb-6">Order Summary</h2>
//           <div className="space-y-4 mb-6">
//             {cartItems.map(item => (
//               <div key={item.variant_id} className="flex justify-between text-xs font-bold uppercase">
//                 <span>{item.title} x{item.quantity}</span>
//                 <span>{formatPKR(item.price * item.quantity)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="border-t border-zinc-200 pt-6">
//             <div className="flex justify-between items-end">
//               <p className="text-[10px] font-black uppercase text-zinc-400">Total Payable</p>
//               <p className="text-3xl font-black italic">{formatPKR(total)}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// import { useState } from 'react';
// import { useCart } from '../hooks/useCart';
// import { useAuth } from '../hooks/useAuth';
// import { supabase } from '../supabaseClient';
// import { formatPKR } from '../utils/formatPrice';
// import { useNavigate } from 'react-router-dom';

// export const Checkout = () => {
//   const navigate = useNavigate();
//   const { cartItems, total, clearCart } = useCart();
//   const { user } = useAuth();
  
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [method, setMethod] = useState('COD');
  
//   const [addressData, setAddressData] = useState({
//     fullName: '',
//     phone: '',
//     line1: '',
//     city: 'Karachi',
//     zip: ''
//   });

//   const handleAddressSubmit = (e) => {
//     e.preventDefault();
//     setStep(2);
//   };

//   const handleFinalOrder = async () => {
//     // 1. Guard: Ensure user is logged in and cart isn't empty
//     if (!user) return alert("Please login to complete your order.");
//     if (cartItems.length === 0) return alert("Your cart is empty.");

//     setLoading(true);
//     try {
//       if (method === 'COD') {
//         // 2. Create Order
//         const { data: order, error: orderErr } = await supabase
//           .from('orders')
//           .insert({
//             user_id: user.id,
//             total_amount: total,
//             payment_method: 'COD',
//             payment_status: 'unpaid',
//             status: 'processing',
//             shipping_phone: addressData.phone
//           })
//           .select()
//           .single();

//         if (orderErr) throw orderErr;

//         // 3. Insert Order Items
//         const { error: itemsErr } = await supabase.from('order_items').insert(
//           cartItems.map(item => ({
//             order_id: order.id,
//             product_id: item.product_id,
//             variant_id: item.variant_id,
//             qty: Number(item.quantity),
//             unit_price: Number(item.price)
//           }))
//         );

//         if (itemsErr) throw itemsErr;

//         // 4. Decrement Stock using SQL RPC
//         // We use Promise.all to run these in parallel for better speed
//         await Promise.all(
//           cartItems.map(item => 
//             supabase.rpc('decrement_stock', { 
//               row_id: item.variant_id, 
//               count: Number(item.quantity) 
//             })
//           )
//         );

//         // 5. Finalize
//         clearCart();
//         navigate('/order-success');
//       } else {
//         // Stripe logic would go here
//         console.log("Redirecting to Stripe...");
//       }
//     } catch (err) {
//       console.error("Checkout Error:", err);
//       alert(err.message || "An error occurred during checkout.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-32 px-6 max-w-4xl mx-auto pb-20">
//       <div className="flex justify-between items-center mb-12">
//         <h1 className="text-3xl font-black italic uppercase tracking-tighter">Checkout</h1>
//         <div className="flex gap-2">
//           <div className={`w-8 h-1 ${step >= 1 ? 'bg-black' : 'bg-zinc-200'}`} />
//           <div className={`w-8 h-1 ${step >= 2 ? 'bg-black' : 'bg-zinc-200'}`} />
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-16">
//         {/* LEFT: FORMS */}
//         <div>
//           {step === 1 ? (
//             <form onSubmit={handleAddressSubmit} className="space-y-6">
//               <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">01. Shipping Information</h2>
//               <div className="grid gap-4">
//                 <input required placeholder="Full Name" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                   onChange={e => setAddressData({...addressData, fullName: e.target.value})} value={addressData.fullName} />
//                 <input required placeholder="Phone Number" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                   onChange={e => setAddressData({...addressData, phone: e.target.value})} value={addressData.phone} />
//                 <input required placeholder="Shipping Address" className="p-4 bg-zinc-50 rounded-xl w-full border-none focus:ring-2 focus:ring-black" 
//                   onChange={e => setAddressData({...addressData, line1: e.target.value})} value={addressData.line1} />
//               </div>
//               <button type="submit" className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-colors">
//                 Continue to Payment
//               </button>
//             </form>
//           ) : (
//             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
//               <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">02. Payment Method</h2>
//               <div className="grid gap-4">
//                 <button onClick={() => setMethod('COD')} className={`p-6 border-2 rounded-2xl text-left transition-all ${method === 'COD' ? 'border-black bg-black text-white' : 'border-zinc-100'}`}>
//                   <p className="font-black italic uppercase">Cash on Delivery</p>
//                   <p className="text-[10px] opacity-60">Pay when you receive your bag.</p>
//                 </button>
//                 <button onClick={() => setMethod('STRIPE')} className={`p-6 border-2 rounded-2xl text-left transition-all ${method === 'STRIPE' ? 'border-black bg-black text-white' : 'border-zinc-100'}`}>
//                   <p className="font-black italic uppercase">Stripe / Credit Card</p>
//                   <p className="text-[10px] opacity-60">Secure online payment.</p>
//                 </button>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <button 
//                   onClick={handleFinalOrder} 
//                   disabled={loading} 
//                   className={`w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-2xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {loading ? 'Processing...' : method === 'COD' ? 'Confirm Order' : 'Pay Now'}
//                 </button>
//                 <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-zinc-400 text-center py-2">Back to Address</button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* RIGHT: SUMMARY */}
//         <div className="bg-zinc-50 p-8 rounded-3xl h-fit sticky top-32">
//           <h2 className="text-xs font-black uppercase tracking-widest mb-6">Order Summary</h2>
//           <div className="space-y-4 mb-6">
//             {cartItems.map(item => (
//               <div key={item.variant_id} className="flex justify-between text-xs font-bold uppercase">
//                 <span>{item.title} x{item.quantity}</span>
//                 <span>{formatPKR(item.price * item.quantity)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="border-t border-zinc-200 pt-6">
//             <div className="flex justify-between items-end">
//               <p className="text-[10px] font-black uppercase text-zinc-400">Total Payable</p>
//               <p className="text-3xl font-black italic">{formatPKR(total)}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



