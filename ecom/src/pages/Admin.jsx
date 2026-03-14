// import { useEffect, useState } from 'react';
// import { supabase } from '../api/supabaseClient';
// import { formatPKR } from '../utils/formatPrice';

// export const Admin = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     supabase
//       .from('orders')
//       .select('*, profiles(name)')
//       .order('created_at', { ascending: false })
//       .then(({ data }) => setOrders(data));
//   }, []);

//   return (
//     <div className="pt-32 px-6 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-black uppercase italic mb-12">
//         Admin Dashboard
//       </h1>

//       <table className="w-full text-left text-[11px] uppercase tracking-wider">
//         <thead>
//           <tr className="border-b border-black">
//             <th className="pb-4">Order</th>
//             <th className="pb-4">Customer</th>
//             <th className="pb-4">Amount</th>
//             <th className="pb-4">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map(o => (
//             <tr key={o.id} className="border-b">
//               <td className="py-6 text-zinc-400">
//                 #{o.id.slice(0, 8)}
//               </td>
//               <td className="py-6 font-bold">
//                 {o.profiles?.name}
//               </td>
//               <td className="py-6 font-black">
//                 {formatPKR(o.total_amount)}
//               </td>
//               <td className="py-6 italic">{o.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
import { useState } from 'react';
import { supabase } from '../supabaseClient';



import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) return alert(error.message);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'admin') {
      navigate('/admin/dashboard'); 
    } else {
      await supabase.auth.signOut();
      alert("Access Denied: You are not an admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] px-4">
      <form onSubmit={handleAdminLogin} className="max-w-md w-full bg-white p-10 rounded-[30px] shadow-sm space-y-6">
        <h2 className="text-3xl font-black italic uppercase text-center">Admin Portal</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Admin Email" className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-black" 
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-black" 
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:opacity-90 transition">
          Secure Login
        </button>
      </form>
    </div>
  );
}