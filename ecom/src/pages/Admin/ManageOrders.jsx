// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';





// export default function ManageOrders() {
//   const [orders, setOrders] = useState([]);

//   const fetchOrders = async () => {
//     // Joining orders with profiles to get Name and Email
//     const { data } = await supabase
//       .from('orders')
//       .select(`
//         id, total_amount, status, created_at,
//         profiles ( name, email )
//       `)
//       .order('created_at', { ascending: false });
//     setOrders(data || []);
//   };

//   const updateStatus = async (id, status) => {
//     await supabase.from('orders').update({ status }).eq('id', id);
//     fetchOrders(); // Live refresh
//   };

//   useEffect(() => { fetchOrders(); }, []);

//   return (
//     <div className="p-8 space-y-8">
//       <h2 className="text-3xl font-black italic uppercase italic">Order Management</h2>
//       <div className="overflow-x-auto bg-white rounded-[20px] border border-gray-100">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
//             <tr>
//               <th className="p-6">Customer Details</th>
//               <th className="p-6">Order ID</th>
//               <th className="p-6">Amount</th>
//               <th className="p-6">Status</th>
//               <th className="p-6">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {orders.map(order => (
//               <tr key={order.id} className="text-sm">
//                 <td className="p-6">
//                   <div className="font-bold">{order.profiles?.name}</div>
//                   <div className="text-gray-400 text-xs">{order.profiles?.email}</div>
//                 </td>
//                 <td className="p-6 font-mono text-xs text-gray-400">#{order.id.slice(0,8)}</td>
//                 <td className="p-6 font-bold">{order.total_amount.toLocaleString()} PKR</td>
//                 <td className="p-6">
//                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
//                     order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
//                   }`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="p-6 flex gap-2">
//                   <button onClick={() => updateStatus(order.id, 'shipped')} className="text-[9px] font-bold border px-3 py-1 rounded-full hover:bg-black hover:text-white transition">Ship</button>
//                   <button onClick={() => updateStatus(order.id, 'delivered')} className="text-[9px] font-bold bg-black text-white px-3 py-1 rounded-full">Deliver</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FiPackage, FiTruck, FiCheckCircle, FiUser, FiHash, FiChevronDown, FiChevronUp, FiMapPin, FiPhone } from 'react-icons/fi';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, 
        total_amount, 
        status, 
        created_at,
        shipping_phone,
        profiles ( name, email ),
        addresses ( line1, city, state, zip ),
        order_items (
          qty,
          unit_price,
          product_variants (
            name,
            products ( title )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) console.error("Fetch error:", error);
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders(); 
  };

  useEffect(() => { fetchOrders(); }, []);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-zinc-900">
          Order Management
        </h2>
        <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase text-gray-500">
          {orders.length} Total Orders
        </span>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block overflow-hidden bg-white rounded-[30px] border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 border-b border-gray-100">
            <tr>
              <th className="p-6">Customer</th>
              <th className="p-6">Order ID</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Details</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <React.Fragment key={order.id}>
                <tr className="text-sm hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 text-zinc-800">
                    <div className="font-bold">{order.profiles?.name || 'Guest User'}</div>
                    <div className="text-gray-400 text-xs italic">{order.profiles?.email}</div>
                  </td>
                  <td className="p-6 font-mono text-xs text-gray-400 italic">#{order.id.slice(0, 8)}</td>
                  <td className="p-6 font-black text-zinc-900">{order.total_amount.toLocaleString()} PKR</td>
                  <td className="p-6">
                    <button 
                      onClick={() => toggleOrder(order.id)}
                      className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 hover:text-black border border-zinc-200 px-3 py-1 rounded-full"
                    >
                      View Items & Address {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2 justify-end">
                      <ActionButton label="Ship" onClick={() => updateStatus(order.id, 'shipped')} primary={order.status === 'shipped'} />
                      <ActionButton label="Deliver" onClick={() => updateStatus(order.id, 'delivered')} primary={order.status === 'delivered'} />
                    </div>
                  </td>
                </tr>

                {expandedOrder === order.id && (
                  <tr className="bg-zinc-50/50">
                    <td colSpan="6" className="p-8 border-b border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm space-y-3">
                          <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                            <FiMapPin /> Shipping Address
                          </h4>
                          <div className="text-xs space-y-1">
                            <p className="font-bold text-zinc-800">{order.profiles?.name}</p>
                            <p className="text-zinc-600">{order.addresses?.line1}</p>
                            <p className="text-zinc-600">{order.addresses?.city}, {order.addresses?.zip}</p>
                            <p className="pt-2 flex items-center gap-2 font-mono text-zinc-500">
                              <FiPhone size={10}/> {order.shipping_phone}
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                            <FiPackage /> Ordered Items ({order.order_items?.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {order.order_items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100">
                                <div>
                                  <p className="text-xs font-bold">{item.product_variants?.products?.title}</p>
                                  <p className="text-[10px] text-zinc-400 uppercase font-medium">{item.product_variants?.name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-black">x{item.qty}</p>
                                  <p className="text-[10px] text-zinc-400">{item.unit_price.toLocaleString()} PKR</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-[25px] border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-gray-400">
                <FiHash size={12} />
                <span className="font-mono text-xs italic">{order.id.slice(0, 8)}</span>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="space-y-2 py-2 border-y border-gray-50">
                <div className="flex items-center gap-2">
                    <FiUser className="text-zinc-400" size={14}/>
                    <span className="font-black text-xs uppercase">{order.profiles?.name}</span>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-zinc-500 ml-1">
                    <FiMapPin className="mt-0.5 flex-shrink-0" size={12}/>
                    <span>{order.addresses?.line1}, {order.addresses?.city}</span>
                </div>
            </div>

            <div className="space-y-2">
              {order.order_items?.map((item, idx) => (
                <div key={idx} className="text-xs flex justify-between bg-zinc-50 p-2 rounded-lg">
                  <span className="font-medium">{item.product_variants?.products?.title} <span className="text-[10px] opacity-50">({item.qty})</span></span>
                  <span className="text-zinc-400 text-[10px]">{item.product_variants?.name}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
              <span className="font-black text-lg">{order.total_amount.toLocaleString()} PKR</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button 
                onClick={() => updateStatus(order.id, 'shipped')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  order.status === 'shipped' ? 'bg-black text-white' : 'border border-gray-200 text-gray-400'
                }`}
              >
                <FiTruck /> Ship
              </button>
              <button 
                onClick={() => updateStatus(order.id, 'delivered')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  order.status === 'delivered' ? 'bg-black text-white' : 'border border-gray-200 text-gray-400'
                }`}
              >
                <FiCheckCircle /> Deliver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, primary }) {
  return (
    <button 
      onClick={onClick} 
      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${
        primary 
        ? 'bg-black text-white border-black shadow-sm' 
        : 'border-gray-200 text-gray-400 bg-white hover:border-black hover:text-black'
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
    const styles = {
      delivered: 'bg-green-100 text-green-600',
      shipped: 'bg-blue-100 text-blue-600',
      processing: 'bg-orange-100 text-orange-600',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
}
// 1/6/26 without details
// import React from 'react';
// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';
// import { FiPackage, FiTruck, FiCheckCircle, FiUser, FiHash, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// export default function ManageOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState(null); // To toggle item details

//   const fetchOrders = async () => {
//     setLoading(true);
// const { data, error } = await supabase
//   .from('orders')
//   .select(`
//     id, 
//     total_amount, 
//     status, 
//     created_at,
//     profiles ( name, email ),
//     order_items (
//       qty,
//       unit_price,
//       product_variants (
//         name,
//         products ( title )
//       )
//     )
//   `)
//   .order('created_at', { ascending: false });

// // DEBUG: Check if data is actually arriving now
// console.log("Orders with items:", data);
//     if (error) console.error("Fetch error:", error);
//     setOrders(data || []);
//     setLoading(false);
//   };

//   const updateStatus = async (id, status) => {
//     await supabase.from('orders').update({ status }).eq('id', id);
//     fetchOrders(); 
//   };

//   useEffect(() => { fetchOrders(); }, []);

//   // Helper to toggle detail view
//   const toggleOrder = (id) => {
//     setExpandedOrder(expandedOrder === id ? null : id);
//   };

//   return (
//     <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-zinc-900">
//           Order Management
//         </h2>
//         <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase text-gray-500">
//           {orders.length} Total Orders
//         </span>
//       </div>

//       {/* DESKTOP TABLE VIEW */}
//       <div className="hidden lg:block overflow-hidden bg-white rounded-[30px] border border-gray-100 shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 border-b border-gray-100">
//             <tr>
//               <th className="p-6">Customer</th>
//               <th className="p-6">Order ID</th>
//               <th className="p-6">Amount</th>
//               <th className="p-6">Items</th>
//               <th className="p-6">Status</th>
//               <th className="p-6 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {orders.map(order => (
//               <React.Fragment key={order.id}>
//                 <tr className="text-sm hover:bg-gray-50/50 transition-colors">
//                   <td className="p-6 text-zinc-800">
//                     <div className="font-bold">{order.profiles?.name || 'Guest User'}</div>
//                     <div className="text-gray-400 text-xs">{order.profiles?.email}</div>
//                   </td>
//                   <td className="p-6 font-mono text-xs text-gray-400 italic">#{order.id.slice(0, 8)}</td>
//                   <td className="p-6 font-black text-zinc-900">{order.total_amount.toLocaleString()} PKR</td>
//                   <td className="p-6">
//                     <button 
//                       onClick={() => toggleOrder(order.id)}
//                       className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 hover:text-black"
//                     >
//                       {order.order_items?.length} Items {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
//                     </button>
//                   </td>
//                   <td className="p-6">
//                     <StatusBadge status={order.status} />
//                   </td>
//                   <td className="p-6">
//                     <div className="flex gap-2 justify-end">
//                       <ActionButton label="Ship" onClick={() => updateStatus(order.id, 'shipped')} primary={order.status === 'shipped'} />
//                       <ActionButton label="Deliver" onClick={() => updateStatus(order.id, 'delivered')} primary={order.status === 'delivered'} />
//                     </div>
//                   </td>
//                 </tr>
//                 {/* Expandable Row for Items */}
//                 {expandedOrder === order.id && (
//                   <tr className="bg-zinc-50/50">
//                     <td colSpan="6" className="p-6 border-b border-gray-100">
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                         {order.order_items?.map((item, idx) => (
//                           <div key={idx} className="flex flex-col p-3 bg-white rounded-xl border border-gray-100">
//                             <span className="text-[10px] font-black uppercase text-zinc-400">Item {idx + 1}</span>
//                             <span className="text-xs font-bold">{item.product_variants?.products?.title}</span>
//                             <span className="text-[10px] text-gray-500">{item.product_variants?.name} — Qty: {item.qty}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE CARD VIEW */}
//       <div className="lg:hidden space-y-4">
//         {orders.map(order => (
//           <div key={order.id} className="bg-white p-6 rounded-[25px] border border-gray-100 shadow-sm space-y-4">
//             <div className="flex justify-between items-start">
//               <div className="flex items-center gap-2 text-gray-400">
//                 <FiHash size={12} />
//                 <span className="font-mono text-xs italic">{order.id.slice(0, 8)}</span>
//               </div>
//               <StatusBadge status={order.status} />
//             </div>

//             <div className="flex items-center gap-3 py-2 border-y border-gray-50">
//               <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
//                 <FiUser />
//               </div>
//               <div>
//                 <p className="font-black text-sm uppercase leading-tight">{order.profiles?.name}</p>
//                 <p className="text-xs text-gray-400">{order.profiles?.email}</p>
//               </div>
//             </div>

//             {/* Mobile Item List */}
//             <div className="space-y-2">
//               <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Items</p>
//               {order.order_items?.map((item, idx) => (
//                 <div key={idx} className="text-xs flex justify-between">
//                   <span className="font-medium">{item.product_variants?.products?.title} ({item.qty})</span>
//                   <span className="text-gray-400">{item.product_variants?.name}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center pt-2 border-t border-gray-50">
//               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
//               <span className="font-black text-lg">{order.total_amount.toLocaleString()} PKR</span>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//                <button 
//                 onClick={() => updateStatus(order.id, 'shipped')}
//                 className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                   order.status === 'shipped' ? 'bg-black text-white shadow-md' : 'border border-gray-200 text-gray-400'
//                 }`}
//               >
//                 <FiTruck /> Ship
//               </button>
//               <button 
//                 onClick={() => updateStatus(order.id, 'delivered')}
//                 className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                   order.status === 'delivered' ? 'bg-black text-white shadow-md' : 'border border-gray-200 text-gray-400'
//                 }`}
//               >
//                 <FiCheckCircle /> Deliver
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ... StatusBadge and ActionButton components stay the same as your original code ...

// // Fixed ActionButton Sub-component
// function ActionButton({ label, onClick, primary }) {
//   return (
//     <button 
//       onClick={onClick} 
//       className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${
//         primary 
//         ? 'bg-black text-white border-black shadow-sm' 
//         : 'border-gray-200 text-gray-400 bg-white hover:border-black hover:text-black'
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// function StatusBadge({ status }) {
//     const styles = {
//       delivered: 'bg-green-100 text-green-600',
//       shipped: 'bg-blue-100 text-blue-600',
//       pending: 'bg-orange-100 text-orange-600',
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
//         {status}
//       </span>
//     );
// }








// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';
// import { FiPackage, FiTruck, FiCheckCircle, FiUser, FiHash } from 'react-icons/fi';

// export default function ManageOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     setLoading(true);
//     const { data } = await supabase
//       .from('orders')
//       .select(`
//         id, total_amount, status, created_at,
//         profiles ( name, email )
//       `)
//       .order('created_at', { ascending: false });
//     setOrders(data || []);
//     setLoading(false);
//   };

//   const updateStatus = async (id, status) => {
//     await supabase.from('orders').update({ status }).eq('id', id);
//     fetchOrders(); 
//   };

//   useEffect(() => { fetchOrders(); }, []);

//   return (
//     <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-zinc-900">
//           Order Management
//         </h2>
//         <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase text-gray-500">
//           {orders.length} Total Orders
//         </span>
//       </div>

//       {/* DESKTOP TABLE VIEW */}
//       <div className="hidden lg:block overflow-hidden bg-white rounded-[30px] border border-gray-100 shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-50/50 text-[10px] uppercase font-black text-gray-400 border-b border-gray-100">
//             <tr>
//               <th className="p-6">Customer Details</th>
//               <th className="p-6">Order ID</th>
//               <th className="p-6">Amount</th>
//               <th className="p-6">Status</th>
//               <th className="p-6 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {orders.map(order => (
//               <tr key={order.id} className="text-sm hover:bg-gray-50/50 transition-colors">
//                 <td className="p-6 text-zinc-800">
//                   <div className="font-bold">{order.profiles?.name || 'Guest User'}</div>
//                   <div className="text-gray-400 text-xs">{order.profiles?.email}</div>
//                 </td>
//                 <td className="p-6 font-mono text-xs text-gray-400 italic">#{order.id.slice(0, 8)}</td>
//                 <td className="p-6 font-black text-zinc-900">{order.total_amount.toLocaleString()} PKR</td>
//                 <td className="p-6">
//                   <StatusBadge status={order.status} />
//                 </td>
//                 <td className="p-6">
//                   <div className="flex gap-2 justify-end">
//                     <ActionButton 
//                         label="Ship" 
//                         onClick={() => updateStatus(order.id, 'shipped')} 
//                         primary={order.status === 'shipped'} 
//                     />
//                     <ActionButton 
//                         label="Deliver" 
//                         onClick={() => updateStatus(order.id, 'delivered')} 
//                         primary={order.status === 'delivered'} 
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE CARD VIEW */}
//       <div className="lg:hidden space-y-4">
//         {orders.map(order => (
//           <div key={order.id} className="bg-white p-6 rounded-[25px] border border-gray-100 shadow-sm space-y-4">
//             <div className="flex justify-between items-start">
//               <div className="flex items-center gap-2 text-gray-400">
//                 <FiHash size={12} />
//                 <span className="font-mono text-xs italic">{order.id.slice(0, 8)}</span>
//               </div>
//               <StatusBadge status={order.status} />
//             </div>

//             <div className="flex items-center gap-3 py-2 border-y border-gray-50">
//               <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
//                 <FiUser />
//               </div>
//               <div>
//                 <p className="font-black text-sm uppercase leading-tight">{order.profiles?.name}</p>
//                 <p className="text-xs text-gray-400">{order.profiles?.email}</p>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
//               <span className="font-black text-lg">{order.total_amount.toLocaleString()} PKR</span>
//             </div>

//             <div className="grid grid-cols-2 gap-3 pt-2">
//               <button 
//                 onClick={() => updateStatus(order.id, 'shipped')}
//                 className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                   order.status === 'shipped' 
//                   ? 'bg-black text-white shadow-md' 
//                   : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
//                 }`}
//               >
//                 <FiTruck /> Ship
//               </button>
//               <button 
//                 onClick={() => updateStatus(order.id, 'delivered')}
//                 className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
//                   order.status === 'delivered' 
//                   ? 'bg-black text-white shadow-md' 
//                   : 'border border-gray-200 text-gray-400 hover:bg-gray-50'
//                 }`}
//               >
//                 <FiCheckCircle /> Deliver
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {orders.length === 0 && !loading && (
//         <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
//           <FiPackage className="mx-auto text-gray-300 mb-4" size={40} />
//           <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No orders found</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // Fixed ActionButton Sub-component
// function ActionButton({ label, onClick, primary }) {
//   return (
//     <button 
//       onClick={onClick} 
//       className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all border ${
//         primary 
//         ? 'bg-black text-white border-black shadow-sm' 
//         : 'border-gray-200 text-gray-400 bg-white hover:border-black hover:text-black'
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// function StatusBadge({ status }) {
//     const styles = {
//       delivered: 'bg-green-100 text-green-600',
//       shipped: 'bg-blue-100 text-blue-600',
//       pending: 'bg-orange-100 text-orange-600',
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
//         {status}
//       </span>
//     );
// }