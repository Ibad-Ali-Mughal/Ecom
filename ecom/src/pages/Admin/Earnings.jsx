// import { useEffect, useState } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';

// export default function Earnings() {
//   const { fetchStats } = useAdmin();
//   const [stats, setStats] = useState({ revenue: 0, totalOrders: 0 });

//   useEffect(() => {
//     const load = async () => setStats(await fetchStats());
//     load();
//   }, []);

//   return (
//     <div className="p-8 space-y-10">
//       <h1 className="text-3xl font-black italic uppercase">Financial Overview</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="p-10 bg-black text-white rounded-[30px] shadow-2xl relative overflow-hidden">
//           <div className="relative z-10">
//             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Total Net Revenue</p>
//             <h2 className="text-5xl font-black italic">{stats.revenue.toLocaleString()} <span className="text-xl">PKR</span></h2>
//           </div>
//           {/* Subtle design element to match SHOP.CO aesthetic */}
//           <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
//         </div>

//         <div className="p-10 bg-white border border-gray-100 rounded-[30px] shadow-sm">
//           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Successful Orders</p>
//           <h2 className="text-5xl font-black italic text-black">{stats.totalOrders}</h2>
//         </div>
//       </div>

//       <div className="p-8 bg-[#F0F0F0] rounded-[20px]">
//         <h4 className="font-bold text-sm uppercase mb-4">Quick Insights</h4>
//         <p className="text-gray-500 text-sm">Your store is currently seeing a steady flow of orders. Use the <span className="text-black font-bold">Manage Orders</span> page to update shipment tracking and keep your customers informed via automated emails.</p>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

export default function Earnings() {
  const { fetchStats, isAdmin } = useAdmin();
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0 });

  useEffect(() => {
    const load = async () => {
      const result = await fetchStats();
      setStats(result);
    };
    
    if (isAdmin) {
      load();
    }
  }, [isAdmin, fetchStats]); 

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-black italic uppercase">Financial Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 bg-black text-white rounded-[30px] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Total Net Revenue</p>
            <h2 className="text-5xl font-black italic">
              {stats.revenue.toLocaleString()} <span className="text-xl">PKR</span>
            </h2>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        </div>

        <div className="p-10 bg-white border border-gray-100 rounded-[30px] shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Successful Orders</p>
          <h2 className="text-5xl font-black italic text-black">{stats.totalOrders}</h2>
        </div>
      </div>

      <div className="p-8 bg-[#F0F0F0] rounded-[20px]">
        <h4 className="font-bold text-sm uppercase mb-4">Quick Insights</h4>
        <p className="text-gray-500 text-sm">
          Your store is currently seeing a steady flow of orders. Use the 
          <span className="text-black font-bold"> Manage Orders</span> page to update shipment tracking.
        </p>
      </div>
    </div>
  );
}