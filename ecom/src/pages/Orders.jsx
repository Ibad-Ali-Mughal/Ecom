import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { formatPKR } from '../utils/formatPrice';

export const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-10">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map(o => (
          <div key={o.id} className="border p-6">
            <p className="text-[10px] uppercase text-zinc-400">
              Order #{o.id.slice(0, 8)}
            </p>
            <p className="font-black italic mt-2">
              {formatPKR(o.total_amount)}
            </p>
            <p className="text-[10px] uppercase mt-1">
              Status: {o.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
